import { database } from './firebase';
import { ref, get, set, push, update, remove, child, query, orderByChild, equalTo, onValue, off } from "firebase/database";

const resourcesRef = ref(database, 'resources');
const bookingsRef = ref(database, 'bookings');

const toArray = (snapshot) => {
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    }));
};


export const subscribeToBookings = (callback) => {
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
        const data = toArray(snapshot);
        callback(data);
    });
    return unsubscribe;
};

export const subscribeToResources = (callback) => {
    const unsubscribe = onValue(resourcesRef, (snapshot) => {
        const data = toArray(snapshot);
        callback(data);
    });
    return unsubscribe;
};


export const getResources = async () => {
    try {
        const snapshot = await get(resourcesRef);
        return toArray(snapshot);
    } catch (error) {
        console.error("Error fetching resources:", error);
        return [];
    }
};

export const getResourceById = async (id) => {
    try {
        const snapshot = await get(child(resourcesRef, id));
        if (snapshot.exists()) {
            return { id: snapshot.key, ...snapshot.val() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching resource:", error);
        return null;
    }
};

export const getBookings = async (resourceId, date) => {
    try {
        const snapshot = await get(bookingsRef);
        const allBookings = toArray(snapshot);
        return allBookings.filter(b => b.resourceId === resourceId && b.date === date);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};

export const getAllBookingsForDate = async (date) => {
    try {
        const snapshot = await get(bookingsRef);
        const allBookings = toArray(snapshot);
        return allBookings.filter(b => b.date === date);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
};

export const getUserBookings = async (userId) => {
    try {
        const [bookingsSnap, resourcesSnap] = await Promise.all([
            get(bookingsRef),
            get(resourcesRef)
        ]);

        const allBookings = toArray(bookingsSnap);
        const userBookings = allBookings.filter(b => b.userId === userId);

        const resourcesMap = {};
        if (resourcesSnap.exists()) {
            const resData = resourcesSnap.val();
            Object.keys(resData).forEach(k => resourcesMap[k] = resData[k]);
        }

        return userBookings.map(booking => {
            const resource = resourcesMap[booking.resourceId];
            return {
                ...booking,
                resourceName: resource ? resource.name : 'Unknown Resource',
                resourceImage: resource ? resource.image : null,
                resourceType: resource ? resource.type : 'Resource'
            };
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return [];
    }
};

export const createBooking = async (bookingData) => {
    const allBookings = await getBookings(bookingData.resourceId, bookingData.date);
    const conflict = allBookings.find(b =>
        b.timeSlot === bookingData.timeSlot &&
        b.status !== 'rejected'
    );

    if (conflict) {
        throw new Error('Slot already booked');
    }

    const newBookingRef = push(bookingsRef);
    const newBooking = {
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    await set(newBookingRef, newBooking);
    return { id: newBookingRef.key, ...newBooking };
};

export const getAllBookings = async () => {
    try {
        const snapshot = await get(bookingsRef);
        return toArray(snapshot);
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return [];
    }
};

export const updateBookingStatus = async (bookingId, newStatus) => {
    const bookingRef = child(bookingsRef, bookingId);
    await update(bookingRef, { status: newStatus });
    return { id: bookingId, status: newStatus };
};

export const addResource = async (resourceData) => {
    const newResourceRef = push(resourcesRef);
    await set(newResourceRef, resourceData);
    return { id: newResourceRef.key, ...resourceData };
};

export const updateResource = async (id, updatedData) => {
    const resourceRef = child(resourcesRef, id);
    await update(resourceRef, updatedData);
    return { id, ...updatedData };
};

export const deleteResource = async (id) => {
    await remove(child(resourcesRef, id));
    const snapshot = await get(bookingsRef);
    if (snapshot.exists()) {
        const bookings = snapshot.val();
        const updates = {};
        Object.keys(bookings).forEach(key => {
            if (bookings[key].resourceId === id) {
                updates[key] = null;
            }
        });
        if (Object.keys(updates).length > 0) {
            await update(bookingsRef, updates);
        }
    }
    return true;
};

export const getResourcesWithBookings = async () => {
    const [resources, bookings] = await Promise.all([
        getResources(),
        getAllBookings()
    ]);

    return resources.map(resource => ({
        ...resource,
        bookings: bookings.filter(b => b.resourceId === resource.id)
    }));
};

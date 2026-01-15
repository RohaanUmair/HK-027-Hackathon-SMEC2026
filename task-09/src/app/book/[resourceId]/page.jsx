'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getResourceById, getBookings, createBooking } from '@/lib/mockData';

export default function BookingPage() {
    const params = useParams();
    const resourceId = params?.resourceId;
    const router = useRouter();

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [existingBookings, setExistingBookings] = useState([]);
    const [message, setMessage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        }
    }, []);

    useEffect(() => {
        if (!resourceId) return;
        const fetchData = async () => {
            const data = await getResourceById(resourceId);
            if (!data) return;
            setResource(data);
            setLoading(false);
        };
        fetchData();
    }, [resourceId]);

    useEffect(() => {
        if (!resourceId || !selectedDate) return;
        const fetchBookings = async () => {
            const bookings = await getBookings(resourceId, selectedDate);
            setExistingBookings(bookings);
        };
        fetchBookings();
    }, [resourceId, selectedDate, message]);

    const getSlotStatus = (slot) => {
        const booking = existingBookings.find(b => b.timeSlot === slot && b.status !== 'rejected');
        if (!booking) return 'available';
        if (currentUser && booking.userId === currentUser.uid) return 'my_booking';
        return 'booked';
    };

    const handleBooking = async () => {
        if (!selectedSlot || !selectedDate) return;

        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/auth');
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            await createBooking({
                resourceId,
                date: selectedDate,
                timeSlot: selectedSlot,
                userId: JSON.parse(user).uid
            });

            setMessage({ type: 'success', text: 'Booking confirmed! Status pending approval.' });

            setExistingBookings(prev => [...prev, {
                timeSlot: selectedSlot,
                userId: JSON.parse(user).uid,
                status: 'pending'
            }]);

            setSelectedSlot(null);
            setTimeout(() => console.log("Email notification sent"), 500);

        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Booking failed. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#F5F7FA]">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#F5F7FA] gap-4">
                <h1 className="text-xl font-bold text-gray-900">Resource Not Found</h1>
                <Link href="/resources" className="text-sm text-black underline underline-offset-4">Return to Catalog</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-gray-200">
            {/* Minimal Nav */}
            <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 mb-8 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Link href="/resources" className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </Link>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">CampusRes</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest hidden sm:block">
                        My Bookings
                    </Link>
                    <Link
                        href="/resources"
                        className="text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-full transition-all flex items-center gap-2"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Resource Profile */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm sticky top-24">
                            <div className="h-48 bg-gray-100 relative">
                                <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded text-xs font-bold uppercase tracking-wider shadow-sm border border-gray-100">
                                        {resource.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h1 className="text-xl font-black text-gray-900 leading-tight mb-2">{resource.name}</h1>
                                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                    {resource.description}
                                </p>

                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest">Capacity</span>
                                        <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1">
                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            {resource.capacity} Students
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amenities</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {resource.features.map((feature, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-50 text-gray-600 border border-gray-100 rounded text-[10px] font-bold uppercase tracking-wide">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Interface */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm h-full flex flex-col min-h-[500px]">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Select Schedule</h2>
                                    <p className="text-xs text-gray-400 mt-1">Choose a date and time slot to reserve this space.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="pl-3 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                                {(resource.timeSlots || []).map(slot => {
                                    const status = getSlotStatus(slot);
                                    const isSelected = selectedSlot === slot;
                                    const isAvailable = status === 'available';

                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => isAvailable && setSelectedSlot(slot)}
                                            disabled={!isAvailable}
                                            className={`
                                                relative p-3 rounded border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 h-20
                                                ${status === 'booked'
                                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                                                    : status === 'my_booking'
                                                        ? 'bg-green-50 border-green-200 text-green-700 cursor-default'
                                                        : isSelected
                                                            ? 'bg-black text-white border-black shadow-lg transform scale-[1.02]'
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>Session</span>
                                            <span className="text-sm">{slot}</span>

                                            {status === 'booked' && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px] rounded">
                                                    <span className="bg-white px-2 py-0.5 rounded text-[9px] font-bold text-red-500 border border-red-100 shadow-sm uppercase tracking-wide">Taken</span>
                                                </div>
                                            )}
                                            {status === 'my_booking' && (
                                                <div className="absolute top-0 right-0 p-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-auto border-t border-gray-100 pt-6">
                                {message && (
                                    <div className={`mb-4 px-4 py-3 rounded text-xs font-bold flex justify-between items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                        <span>{message.text}</span>
                                        {message.type === 'success' && (
                                            <Link href="/dashboard" className="underline underline-offset-2 hover:text-green-900">View Dashboard</Link>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={!selectedSlot || submitting}
                                    className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                                >
                                    {submitting ? 'Processing Request...' : 'Confirm Reservation'}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
                                    By booking, you agree to the campus facility usage guidelines.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

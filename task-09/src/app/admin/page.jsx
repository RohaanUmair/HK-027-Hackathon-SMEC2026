'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    getAllBookings,
    updateBookingStatus,
    addResource,
    updateResource,
    deleteResource,
    getResourcesWithBookings,
    subscribeToBookings,
    subscribeToResources
} from '@/lib/mockData';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [resourceForm, setResourceForm] = useState({
        name: '',
        type: 'Lab',
        capacity: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: '',
        timeSlots: ''
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/auth');
            return;
        }
        const parsed = JSON.parse(user);
        if (parsed.role !== 'admin') {
            router.push('/resources');
            return;
        }
    }, [router]);

    useEffect(() => {
        setLoading(true);
        const unsubBookings = subscribeToBookings((data) => {
            setBookings(data);
            setLoading(false);
        });

        const unsubResources = subscribeToResources((data) => {
            setResources(data);
        });

        return () => {
            unsubBookings();
            unsubResources();
        };
    }, []);

    const resourcesWithBookings = resources.map(resource => ({
        ...resource,
        bookings: bookings.filter(b => b.resourceId === resource.id)
    }));

    const handleStatusUpdate = async (bookingId, newStatus) => {
        setActionLoading(bookingId);
        try {
            await updateBookingStatus(bookingId, newStatus);
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const resetForm = () => {
        setResourceForm({
            name: '',
            type: 'Lab',
            capacity: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            features: ''
        });
        setEditingResource(null);
        setShowForm(false);
    };

    const handleEditClick = (resource) => {
        setEditingResource(resource);
        setResourceForm({
            name: resource.name,
            type: resource.type,
            capacity: resource.capacity,
            description: resource.description,
            image: resource.image,
            features: resource.features.join(', '),
            timeSlots: resource.timeSlots ? resource.timeSlots.join(', ') : ''
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleResourceSubmit = async (e) => {
        e.preventDefault();
        setActionLoading('resource-submit');

        const payload = {
            ...resourceForm,
            capacity: parseInt(resourceForm.capacity),
            features: resourceForm.features.split(',').map(f => f.trim()).filter(Boolean),
            timeSlots: resourceForm.timeSlots.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            if (editingResource) {
                await updateResource(editingResource.id, payload);
            } else {
                await addResource(payload);
            }
            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteResource = async () => {
        if (!editingResource || !confirm('Are you sure you want to delete this resource? This action cannot be undone.')) return;

        setActionLoading('resource-delete');
        try {
            await deleteResource(editingResource.id);
            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const pendingBookings = bookings.filter(b => b.status === 'pending');

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#F5F7FA]">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans flex text-gray-900 selection:bg-gray-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen z-10">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-lg font-black tracking-tight">Admin<span className="text-gray-400 font-normal">Panel</span></span>
                </div>

                <nav className="p-4 space-y-1 flex-1">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'bookings'
                            ? 'bg-black text-white hover:bg-gray-900 shadow-md'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        Bookings
                        {pendingBookings.length > 0 && (
                            <span className="ml-auto bg-amber-400 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black">
                                {pendingBookings.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'resources'
                            ? 'bg-black text-white hover:bg-gray-900 shadow-md'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Resources
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/auth"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        onClick={() => {
                            document.cookie = "user_role=; path=/; max-age=0";
                            localStorage.removeItem('user');
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-gray-200 p-4 fixed top-0 w-full z-20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-lg font-black tracking-tight">Admin</span>
                </div>
                <div className="flex gap-4 text-xs font-bold text-gray-500">
                    <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'text-black' : ''}>Bookings</button>
                    <button onClick={() => setActiveTab('resources')} className={activeTab === 'resources' ? 'text-black' : ''}>Resources</button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 max-w-7xl mx-auto w-full">
                {/* Top Nav */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                            {activeTab === 'bookings' ? 'Booking Management' : 'Resource Control'}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">
                            {activeTab === 'bookings'
                                ? 'Review and manage incoming reservation requests.'
                                : 'Add, edit, or remove facility resources.'}
                        </p>
                    </div>
                    <Link href="/resources" className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest hidden md:block">
                        View Live Site ↗
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                        <div className="text-4xl font-black text-gray-900 mb-1">{resourcesWithBookings.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Assets</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 relative overflow-hidden">
                        <div className="text-4xl font-black text-amber-500 mb-1">{pendingBookings.length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Review</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                        <div className="text-4xl font-black text-green-600 mb-1">{bookings.filter(b => b.status === 'approved').length}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Sessions</div>
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === 'bookings' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {bookings.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 text-sm font-medium">No booking requests found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
                                        <tr>
                                            <th className="px-6 py-4 tracking-wider">Facility</th>
                                            <th className="px-6 py-4 tracking-wider">Schedule</th>
                                            <th className="px-6 py-4 tracking-wider">Requested By</th>
                                            <th className="px-6 py-4 tracking-wider">Status</th>
                                            <th className="px-6 py-4 tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {bookings.map(booking => {
                                            const resource = resourcesWithBookings.find(r => r.id === booking.resourceId);
                                            return (
                                                <tr key={booking.id} className="hover:bg-gray-50/[0.3] transition-colors group">
                                                    <td className="px-6 py-4 font-bold text-gray-900">
                                                        {resource?.name || booking.resourceId}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 font-medium">
                                                        <div className="flex flex-col">
                                                            <span>{booking.date}</span>
                                                            <span className="text-xs text-gray-400">{booking.timeSlot}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {booking.userEmail || booking.userId}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${booking.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            booking.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                                'bg-amber-50 text-amber-700 border-amber-100'
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {booking.status === 'pending' ? (
                                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                                    disabled={actionLoading === booking.id}
                                                                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded shadow-sm disabled:opacity-50"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                                    disabled={actionLoading === booking.id}
                                                                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-red-600 text-xs font-bold rounded shadow-sm disabled:opacity-50"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 font-bold text-xs uppercase">Decided</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Resources Tab */
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-5 py-2.5 bg-black hover:bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-black/20"
                                >
                                    + New Resource
                                </button>
                            )}
                        </div>

                        {showForm && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h3 className="text-lg font-black text-gray-900">
                                        {editingResource ? 'Edit Facility' : 'Define New Facility'}
                                    </h3>
                                    <button onClick={resetForm} className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-wider">
                                        Close
                                    </button>
                                </div>

                                <form onSubmit={handleResourceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={resourceForm.name}
                                            onChange={(e) => setResourceForm({ ...resourceForm, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                            placeholder="e.g. Innovation Lab"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Type</label>
                                        <select
                                            value={resourceForm.type}
                                            onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                        >
                                            <option value="Lab">Lab</option>
                                            <option value="Hall">Hall</option>
                                            <option value="Room">Room</option>
                                            <option value="Equipment">Equipment</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Capacity</label>
                                        <input
                                            type="number"
                                            required
                                            value={resourceForm.capacity}
                                            onChange={(e) => setResourceForm({ ...resourceForm, capacity: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                            placeholder="30"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image URL</label>
                                        <input
                                            type="url"
                                            value={resourceForm.image}
                                            onChange={(e) => setResourceForm({ ...resourceForm, image: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                                        <textarea
                                            required
                                            value={resourceForm.description}
                                            onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                            rows={2}
                                            placeholder="Brief description..."
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Amenities (comma separated)</label>
                                        <input
                                            type="text"
                                            value={resourceForm.features}
                                            onChange={(e) => setResourceForm({ ...resourceForm, features: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                            placeholder="Projector, AC, WiFi"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Slots (comma separated)</label>
                                        <input
                                            type="text"
                                            value={resourceForm.timeSlots}
                                            onChange={(e) => setResourceForm({ ...resourceForm, timeSlots: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                            placeholder="09:00-11:00, 11:00-13:00 (Defaults used if empty)"
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4 flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={actionLoading === 'resource-submit'}
                                            className="flex-1 py-4 bg-black text-white font-black uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-50 hover:bg-gray-900 transition-colors"
                                        >
                                            {actionLoading === 'resource-submit'
                                                ? 'Saving...'
                                                : (editingResource ? 'Update Changes' : 'Confirm Creation')}
                                        </button>

                                        {editingResource && (
                                            <button
                                                type="button"
                                                onClick={handleDeleteResource}
                                                disabled={actionLoading === 'resource-delete'}
                                                className="px-8 py-4 bg-red-50 text-red-600 font-black uppercase tracking-widest rounded-lg border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === 'resource-delete' ? '...' : 'Delete'}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            {resourcesWithBookings.map(resource => (
                                <div key={resource.id} className="bg-white rounded-xl border border-gray-200 p-1 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-shadow group">
                                    <div className="w-full md:w-56 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                                        <img src={resource.image} alt={resource.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                                                {resource.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 py-4 pr-6 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900">{resource.name}</h3>
                                                <p className="text-xs text-gray-500 font-medium mt-1">Capacity: {resource.capacity} • {resource.features.join(', ')}</p>
                                            </div>
                                            {resource.bookings.length > 0 && (
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wide border border-blue-100">
                                                    {resource.bookings.length} Bookings
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{resource.description}</p>

                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {/* Avatars placeholder */}
                                            </div>
                                            <button
                                                onClick={() => handleEditClick(resource)}
                                                className="text-xs font-bold text-gray-400 group-hover:text-black uppercase tracking-wider transition-colors hover:underline underline-offset-4"
                                            >
                                                Manage ↗
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

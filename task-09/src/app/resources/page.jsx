"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getResources, getAllBookingsForDate } from '@/lib/mockData';

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            const [resourcesData, bookingsData] = await Promise.all([
                getResources(),
                getAllBookingsForDate(today)
            ]);
            setResources(resourcesData);
            setBookings(bookingsData);
            setLoading(false);
        };
        fetchData();
    }, [today]);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || resource.type === filterType;
        return matchesSearch && matchesType;
    });

    const uniqueTypes = ['All', ...new Set(resources.map(r => r.type))];

    const getAvailableSlots = (resource) => {
        const resourceBookings = bookings.filter(b => b.resourceId === resource.id);
        const bookedSlots = resourceBookings.map(b => b.timeSlot);
        const slots = resource.timeSlots || [];
        return slots.filter(slot => !bookedSlots.includes(slot));
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-blue-100">
            {/* Minimalist Top Nav */}
            <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">CampusRes</span>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="hidden sm:block text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                        My Bookings
                    </Link>
                    <span className="hidden sm:block text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                    <Link
                        href="/auth"
                        className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest"
                        onClick={() => {
                            document.cookie = "user_role=; path=/; max-age=0";
                            localStorage.removeItem('user');
                        }}
                    >
                        Sign out
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                {/* Header & Controls Section */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Workspace Catalog</h1>
                            <p className="text-gray-500 text-sm max-w-lg">
                                Access real-time availability for labs, seminar halls, and equipment across campus.
                            </p>
                        </div>

                        {/* Compact Search */}
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search facilities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm"
                            />
                            <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Minimal Tab Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-gray-200">
                        {uniqueTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${filterType === type
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredResources.map(resource => {
                            const availableSlots = getAvailableSlots(resource);
                            const isAvailable = availableSlots.length > 0;

                            return (
                                <div key={resource.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg transition-all duration-200 group">
                                    {/* Compact Thumbnail */}
                                    <div className="h-40 relative bg-gray-100 overflow-hidden">
                                        <img
                                            src={resource.image}
                                            alt={resource.name}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="px-2 py-1 bg-black/80 backdrop-blur-sm text-white rounded text-[10px] font-bold uppercase tracking-wider">
                                                {resource.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dense Info Card */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-gray-900 leading-snug pr-2">
                                                {resource.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-[10px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-gray-500 font-semibold whitespace-nowrap">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                                {resource.capacity}
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                                            {resource.description}
                                        </p>

                                        <div className="mt-auto border-t border-gray-100 pt-3 flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Availability</span>
                                                <span className={`text-[10px] font-bold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                                    {isAvailable ? `${availableSlots.length} Slots` : 'Full'}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1 min-h-[26px]">
                                                {isAvailable ? (
                                                    availableSlots.slice(0, 3).map(slot => (
                                                        <span key={slot} className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-[4px] text-[9px] font-semibold">
                                                            {slot}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 italic">No slots available</span>
                                                )}
                                                {isAvailable && availableSlots.length > 3 && (
                                                    <span className="px-1.5 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-[4px] text-[9px] font-semibold">+{availableSlots.length - 3}</span>
                                                )}
                                            </div>

                                            <Link
                                                href={`/book/${resource.id}`}
                                                className={`w-full py-2 rounded text-[10px] font-bold uppercase tracking-widest text-center transition-all mt-1 ${isAvailable
                                                    ? 'bg-black text-white hover:bg-gray-800 shadow-md'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {isAvailable ? 'Book Now' : 'Reserved'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredResources.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">No matching workspace found</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterType('All'); }}
                            className="text-xs text-blue-600 font-bold mt-2 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subscribeToBookings, subscribeToResources } from '@/lib/mockData';

export default function DashboardPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        let bookingsData = [];
        let resourcesData = [];

        const updateState = () => {
            const userBookings = bookingsData.filter(b => b.userId === user.uid);

            const enrichedBookings = userBookings.map(booking => {
                const resource = resourcesData.find(r => r.id === booking.resourceId);
                return {
                    ...booking,
                    resourceName: resource ? resource.name : 'Unknown Resource',
                    resourceImage: resource ? resource.image : null,
                    resourceType: resource ? resource.type : 'Resource'
                };
            });

            enrichedBookings.sort((a, b) => new Date(b.date) - new Date(a.date));
            setBookings(enrichedBookings);
            setLoading(false);
        };

        const unsubBookings = subscribeToBookings((data) => {
            bookingsData = data;
            updateState();
        });

        const unsubResources = subscribeToResources((data) => {
            resourcesData = data;
            updateState();
        });

        return () => {
            unsubBookings();
            unsubResources();
        };
    }, [user]);

    if (!user) return null;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-600 border-red-100';
            case 'pending':
            default:
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans selection:bg-gray-200">
            {/* Nav */}
            <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/resources" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">C</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">CampusRes</span>
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/resources" className="text-xs font-bold text-gray-500 hover:text-black transition-colors uppercase tracking-widest">
                        Catalog
                    </Link>
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

            <main className="max-w-4xl mx-auto px-4 md:px-8 py-10">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1">My Bookings</h1>
                        <p className="text-sm text-gray-500">Track the status of your facility requests.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No bookings yet</h3>
                        <p className="text-sm text-gray-500 mt-2 mb-6">You haven't made any reservation requests.</p>
                        <Link href="/resources" className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded shadow hover:bg-gray-800 transition-all">
                            Browse Catalog
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-md transition-shadow">
                                {/* Image / Icon */}
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                    {booking.resourceImage ? (
                                        <img src={booking.resourceImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-base">{booking.resourceName}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            {booking.date}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            {booking.timeSlot}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AuthPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userCredential;
            let userRole = 'student';

            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                if (formData.name) {
                    await updateProfile(userCredential.user, {
                        displayName: formData.name
                    });
                }
            }

            if (formData.email === 'admin@campus.com') {
                userRole = 'admin';
            }

            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: userCredential.user.displayName || formData.name || 'User',
                role: userRole
            };
            localStorage.setItem('user', JSON.stringify(userData));

            document.cookie = `user_role=${userRole}; path=/; max-age=86400; SameSite=Strict`;

            if (userRole === 'admin') {
                router.push('/admin');
            } else {
                router.push('/resources');
            }

        } catch (err) {
            console.error(err);
            let msg = 'Authentication failed. Please try again.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                msg = 'Invalid email or password.';
            } else if (err.code === 'auth/email-already-in-use') {
                msg = 'Email is already registered.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.';
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Left Section: Contextual / Visual (Hidden on mobile/tablet) */}
            <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 px-12 py-12 text-white flex-col justify-between overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600 blur-[120px] mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600 blur-[120px] mix-blend-screen animate-pulse delay-700"></div>
                </div>

                <div className="z-10 relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-8 bg-indigo-400"></div>
                        <p className="text-xs tracking-[0.2em] uppercase text-indigo-200 font-bold">System Overview</p>
                    </div>
                </div>

                <div className="z-10 relative max-w-lg">
                    <h1 className="text-5xl font-black leading-tight mb-6 tracking-tight">
                        Seamless <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">Campus</span> <br />
                        Booking
                    </h1>
                    <p className="text-indigo-100 text-base leading-relaxed font-light border-l-4 border-indigo-500 pl-6">
                        "Digitizing campus resources with real-time availability, conflict-free scheduling, and instant admin approvals."
                    </p>
                </div>

                <div className="z-10 relative text-xs text-indigo-300/50 font-medium">
                    © 2026 Campus Resource System
                </div>
            </div>

            {/* Right Section: Auth Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-6 shadow-xl lg:shadow-none z-10 overflow-y-auto">
                <div className="w-full max-w-[380px] space-y-6">

                    {/* Header */}
                    <div className="text-center lg:text-left transition-all duration-300">
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? 'Sign in to book labs, halls, and equipment.' : 'Join to start booking campus resources.'}
                        </p>
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleAuth}>
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            {/* Full Name Field (Sign Up Only) */}
                            {!isLogin && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <label className="block text-gray-700 text-xs font-bold mb-1.5 ml-1" htmlFor="name">
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 ease-in-out font-medium text-sm"
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-1.5 ml-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 ease-in-out font-medium text-sm"
                                    id="email"
                                    type="email"
                                    placeholder={isLogin ? "admin@campus.com" : "student@campus.com"}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-1.5 ml-1">
                                    <label className="block text-gray-700 text-xs font-bold" htmlFor="password">
                                        Password
                                    </label>
                                    {isLogin && (
                                        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                                            Forgot?
                                        </a>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 ease-in-out font-medium pr-10 text-sm"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-all"
                                    id="remember"
                                />
                                <label htmlFor="remember" className="ml-2 block text-xs font-medium text-gray-700 select-none cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                        )}

                        <div className="space-y-3">
                            <button
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-900/20 shadow-lg shadow-gray-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.99] text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-500 font-medium pt-2 text-xs">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors underline-offset-4 hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
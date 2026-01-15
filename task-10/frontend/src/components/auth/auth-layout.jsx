import React from "react";
import { Recycle } from "lucide-react";

export default function AuthLayout({ children, title, description }) {
    return (
        <div className="min-h-screen w-full flex bg-[#0a0a0b] overflow-hidden">
            {/* Branding Side - Hidden on Mobile */}
            <div className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-premium-gradient" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[100px] rounded-full" />

                <div className="relative z-10 flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                        <Recycle className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-white">ReUseX</span>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-6xl font-black text-white leading-tight mb-6">
                        Rent, Barter, <br />
                        <span className="text-blue-500">Reimagine</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        The modern platform for smart resource sharing. List your items,
                        rent what you need, or barter for something new. Join the community
                        driving sustainability through sharing.
                    </p>
                </div>

                <div className="relative z-10 flex gap-8 text-slate-500 text-sm">
                    <span>&copy; 2026 ReUseX Inc.</span>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Recycle className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white">ReUseX</span>
                </div>

                <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl border border-white/10 shadow-3xl">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                        <p className="text-slate-400">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}

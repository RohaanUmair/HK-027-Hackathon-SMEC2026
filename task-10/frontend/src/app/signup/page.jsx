"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <AuthLayout
            title="Create account"
            description="Join the ReUseX community today"
        >
            <form className="space-y-4" onSubmit={handleSignup}>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Full Name"
                        className="pl-12"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="pl-12"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            type="password"
                            placeholder="Confirm"
                            className="pl-12"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500/50"
                        required
                    />
                    <label htmlFor="terms" className="text-sm text-slate-400">
                        I agree to the{" "}
                        <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
                        {" "}and{" "}
                        <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <Button className="w-full h-12 text-base font-semibold mt-4" size="lg" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-slate-400 text-sm mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

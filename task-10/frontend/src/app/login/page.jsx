"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Chrome, Github } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGithubLogin = async () => {
        try {
            await signInWithPopup(auth, new GithubAuthProvider());
            router.push("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account"
        >
            <form className="space-y-5" onSubmit={handleLogin}>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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

                <div className="space-y-1.5">
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
                    <div className="flex justify-end">
                        <button type="button" className="text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors">
                            Forgot password?
                        </button>
                    </div>
                </div>

                <Button className="w-full h-12 text-base font-semibold" size="lg" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0a0a0b] px-4 text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline" className="h-12" onClick={handleGoogleLogin}>
                        <Chrome className="w-5 h-5 mr-2" />
                        Google
                    </Button>
                    <Button type="button" variant="outline" className="h-12" onClick={handleGithubLogin}>
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                    </Button>
                </div>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-medium text-slate-300 ml-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white ring-offset-transparent transition-all placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm",
                    error && "border-red-500 focus:ring-red-500/50 focus:border-red-500/50",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export { Input };

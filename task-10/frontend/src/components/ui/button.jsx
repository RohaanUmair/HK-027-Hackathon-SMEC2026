import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20",
        ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/10"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg font-semibold"
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = "Button";

export { Button };

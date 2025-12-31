"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
    placeholder: string;
    buttonLabel: string;
    searchPath?: string;
};

export function SearchBar({
    placeholder,
    buttonLabel,
    searchPath = "/search",
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `${searchPath}?q=${encodeURIComponent(query)}`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div
                className={cn(
                    "relative flex items-center glass-panel rounded-2xl transition-all duration-300",
                    isFocused && "glow-box ring-1 ring-primary/30"
                )}
            >
                <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full py-4 pl-14 pr-6 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
                />
                {query && (
                    <button
                        type="submit"
                        className="absolute right-3 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        {buttonLabel}
                    </button>
                )}
            </div>
        </form>
    );
}

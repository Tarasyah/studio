
"use client";
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
    onSearch: (city: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
            setSearchTerm("");
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-white/10 border-white/20 rounded-full shadow-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/80 text-white"
            />
        </form>
    );
}

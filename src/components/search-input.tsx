
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-full shadow-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
        </form>
    );
}

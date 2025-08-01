
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { cities } from '@/lib/cities';

interface SearchInputProps {
    onSearch: (city: string) => void;
}

export function SearchInput({ onSearch }: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const filteredCities = cities
                .filter(city => city.toLowerCase().startsWith(searchTerm.toLowerCase()))
                .map(city => city)
                .slice(0, 5); // Limit to 5 suggestions
            setSuggestions(filteredCities);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchTerm]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim());
            setSearchTerm("");
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = (city: string) => {
        onSearch(city);
        setSearchTerm("");
        setShowSuggestions(false);
    };

    return (
        <div className="relative" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                <Input
                  type="text"
                  placeholder="Search for a city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowSuggestions(searchTerm.length > 1)}
                  className="w-full pl-11 pr-4 py-2 bg-white/10 border-white/20 rounded-full shadow-sm placeholder:text-white/60 focus:ring-2 focus:ring-white/80 text-white"
                  autoComplete="off"
                />
            </form>
            {showSuggestions && suggestions.length > 0 && (
                 <ul className="absolute z-10 w-full mt-2 bg-gray-800/90 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden">
                    {suggestions.map((city, index) => (
                        <li 
                            key={index} 
                            className="px-4 py-2 cursor-pointer text-white hover:bg-white/10"
                            onClick={() => handleSuggestionClick(city)}
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

"use client";
import React from "react";
import { useAddSearchHistory } from "@/hooks/api/Search/useAddSearchHistory";
import { useAuth } from "@/hooks/auth/useAuth";
import Button from "../Buttons/Button";

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
}

export const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const { user } = useAuth();
  const addSearchHistory = useAddSearchHistory();

  const handleSearch = (query: string) => {
    // Implement search logic here, e.g., redirect to search results page
    if (user?.id) {
      addSearchHistory.mutate({ query });
    }
  };

  return (
    <div className="flex w-full flex-row items-center space-x-2">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && user?.id) {
            addSearchHistory.mutate({
              query: e.currentTarget.value,
            });
          }
        }}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-green-500"
      />
      <Button
        text="Search"
        className="bg-[#88B04B] text-white rounded-md hover:bg-green-600 transform ease-in-out duration-300"
        onClick={() => handleSearch(query)}
      />
    </div>
  );
};

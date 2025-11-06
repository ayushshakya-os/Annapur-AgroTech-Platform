"use client";

import React, { useState, useRef, useEffect } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Address {
  _id: string;
  address: string;
  city: string;
  state: string;
}

interface UserAddressSelectorProps {
  user: User;
  addresses: Address[];
  selectedAddressId: string; // address id or "new"
  onSelectAddress: (id: string) => void;
}

export default function UserAddressSelector({
  user,
  addresses,
  selectedAddressId,
  onSelectAddress,
}: UserAddressSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const listOptions = [
    ...addresses.map((a) => ({
      id: String(a._id),
      label: `${a.address}, ${a.city}, ${a.state}`,
    })),
    { id: "new", label: "Add New Address" },
  ];

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    listOptions.find((o) => o.id === selectedAddressId)?.label ??
    "Select shipping address";

  return (
    <div className="mb-6">
      {/* Profile details */}
      <div className="mb-4 p-4 rounded bg-gray-50 border">
        <div className="font-semibold mb-1">Profile Details</div>
        <div>
          <span className="font-medium">Name:</span> {user.firstName}{" "}
          {user.lastName}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {user.phone}
        </div>
      </div>

      {/* Custom dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-left flex justify-between items-center"
        >
          <span>{selectedLabel}</span>
          <svg
            className={`w-4 h-4 ml-2 transform transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && (
          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded py-1 text-base border border-gray-200 overflow-auto">
            {listOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onSelectAddress(option.id);
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-2 flex items-center hover:bg-blue-100 ${
                  option.id === selectedAddressId
                    ? "bg-blue-50 font-medium"
                    : ""
                }`}
              >
                <span className="flex-1">{option.label}</span>
                {option.id === selectedAddressId && (
                  <span className="text-blue-600 ml-2">✓</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

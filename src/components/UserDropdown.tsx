"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import Button from "./ui/Buttons/Button";
import { X } from "lucide-react";

export default function UserDropdown() {
  const [auth, setAuth] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Detect outside click to close dropdown
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

  // Load auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  // Show only if user is logged in (not a guest)
  if (!auth || auth.isGuest) return null;

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="focus:outline-none flex items-center justify-center"
      >
        <Image
          src="/image/user.png" // Replace with your own avatar image
          alt="User"
          width={30}
          height={30}
          className="rounded-full border border-gray-300"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md z-50">
          <Link
            href="/my-account"
            className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
          >
            My Account
          </Link>
          <Link
            href="/order-history"
            className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
          >
            Order History
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Logout
          </button>
          {showLogoutConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-[5px] bg-opacity-30  transition duration-300 ease-in-out overflow-hidden">
              <div className="relative flex flex-col justify-center items-center mt-4 mb-6 bg-white shadow-lg border border-gray-300 rounded p-5 w-[540px]">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="relative bottom-2 left-60 flex text-right items-end justify-end rounded-full p-1 hover:bg-[#151515] hover:text-white transition duration-300 ease-in-out"
                >
                  <X
                    size={20}
                    className="text-[#353535] hover:text-[white] transform transition duration-300 ease-in-out "
                  />
                </button>
                <div className="flex flex-col justify-center items-center text-center px-10 mb-5">
                  <div className="rounded-full bg-[#FFF8F8] p-2">
                    <Image
                      src="/image/logout.svg"
                      alt="logout"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-dm-sans font-medium text-[24px] text-[#565656]">
                      Logout?
                    </h2>
                    <p className="font-raleway font-normal text-[15px] text-[#969696]">
                      Are you sure you want to logout? You can still explore
                      using the guest account.
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-end gap-4">
                  <Button
                    text="Go Back"
                    className=" w-full text-center justify-center bg-[#88B04B] text-white hover:bg-[#FFFFFF] hover:text-[#88B04B] border border-[#88B04B] transition-colors duration-300"
                    onClick={() => setShowLogoutConfirm(false)}
                  />
                  <Button
                    text="LOGOUT"
                    className="w-full text-center justify-center bg-[#FFFFFF] text-[#88B04B] hover:bg-[#88B04B] hover:text-[#FFFFFF] border border-[#88B04B] transition-colors duration-300"
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

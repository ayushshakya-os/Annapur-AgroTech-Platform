"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/context/useCart";
import {
  FaPhoneAlt,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMailBulk,
} from "react-icons/fa";
import Link from "next/link";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import { requestNotificationPermission } from "@/hooks/api/sendNotifications";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [auth, setAuth] = useState<any>(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if the component is mounted on the client side
  useEffect(() => {
    setIsClient(true);
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      setAuth(parsedAuth);

      // Request notification permission on client side
      if (auth?.isGuest === false) {
        requestNotificationPermission();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    window.location.href = "/";
  };

  // Disable body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const { getTotalQuantity, getUniqueItemCount } = useCart();
  const badgeCount = getUniqueItemCount();

  return (
    <header className="w-full fixed  h-[115px] top-0 left-0 z-50 bg-white">
      {/* Top Bar */}
      <div className="bg-[#88B04B] w-[100%] text-sm sm:flex hidden flex-col sm:flex-row justify-between items-center  sm:px-16 py-2 border-b border-white">
        <div className="flex items-center text-white text-[14px] font-montserrat mb-1 md:mb-0 gap-5">
          <div className="flex items-center gap-2">
            <FaPhoneAlt size={12} />
            <span>Call Us: +977 982-3821451</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMailBulk size={12} />
            <span>Mail Us: 3k6Mh@example.com</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaFacebook className="text-white" />
          <FaInstagram className="text-white" />
          <FaGithub className="text-white" />
          <FaLinkedin className="text-white" />
        </div>
      </div>

      {/* Main Header Bar */}
      <nav className="flex flex-row justify-between bg-white items-center w-full py-2 px-4 sm:px-8 border-b border-white gap-4 sm:gap-0">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image src="/image/logo.png" width={130} height={50} alt="Logo" />
          </Link>
        </div>

        {/* Nav Items */}
        <div className="sm:flex hidden flex-col sm:flex-row gap-2 md:gap-10 sm:gap-4 text-sm font-montserrat text-center">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "text-[#88B04B] underline" : "text-black"
            } hover:text-[#88B04B]`}
          >
            Home
          </Link>
          <Link
            href="/market"
            className={`${
              pathname === "/market" ? "text-[#88B04B] underline" : "text-black"
            } hover:text-[#88B04B]`}
          >
            Market
          </Link>
          <Link
            href="/bidding-portal"
            className={`${
              pathname === "/bidding-portal"
                ? "text-[#88B04B] underline"
                : "text-black"
            } hover:text-[#88B04B]`}
          >
            Bidding Portal
          </Link>
          <Link
            href="/aboutus"
            className={`${
              pathname === "/aboutus"
                ? "text-[#88B04B] underline"
                : "text-black"
            } hover:text-[#88B04B]`}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className={`${
              pathname === "/contact"
                ? "text-[#88B04B] underline"
                : "text-black"
            } hover:text-[#88B04B]`}
          >
            Contact Us
          </Link>
        </div>

        <div className="relative flex items-center gap-4">
          {/* Cart Icon */}
          <div className="hidden sm:block relative">
            <Link href="/cart">
              <FaCartShopping className="text-2xl text-[#88B04B] sm:block hidden" />
              {isClient && getTotalQuantity() > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#151515]  text-[#88B04B] text-[14px] font-bold w-5 h-5 p-0 flex items-center justify-center rounded-full">
                  {badgeCount}
                </span>
              )}
            </Link>
          </div>

          {isClient && auth && !auth.isGuest ? (
            <div className="hidden sm:block relative">
              <UserDropdown />
            </div>
          ) : (
            // Show Create Account link for guests
            <div className="hidden sm:block">
              <Link href="/create-account">
                <FaUser className="text-2xl text-[#88B04B]" />
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu */}
        <div className={`sm:hidden flex items-center gap-5 `}>
          {/* Mobile Cart Icon */}
          <Link href="/cart" className="relative">
            <FaCartShopping className="text-2xl text-[#88B04B]" />
            {isClient && getTotalQuantity() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#151515] text-[#88B04B] text-[14px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {badgeCount}
              </span>
            )}
          </Link>

          {/* Mobile User Icon */}
          {isClient && auth && !auth.isGuest ? (
            <UserDropdown />
          ) : (
            // Show Create Account link for guests
            <div className="hidden sm:block">
              <Link href="/create-account">
                <FaUser className="text-2xl text-[#88B04B]" />
              </Link>
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Mobile Menu */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            className={`fixed top-0 right-0 w-[60%] h-screen bg-[#F8F8F8] border-l border-gray-200 rounded-l-3xl z-50 shadow-xl flex flex-col items-start justify-start p-6 gap-9  transform transition-transform duration-500 ease-in-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button onClick={() => setIsOpen(!isOpen)} className="">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-gray-700 text-[14px] font-montserrat mb-1 sm:mb-0">
                <FaPhoneAlt size={12} />
                <span>Call Us: +977 982-3821451</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700 text-[14px] font-montserrat mb-1 sm:mb-0">
                <FaMailBulk size={12} />
                <span>Mail Us: 3k6Mh@example.com</span>
              </div>
              <div className="flex items-center justify-start gap-2">
                <FaFacebook className="text-[#3b5998]" />
                <FaInstagram className="text-[#e4405f]" />
                <FaGithub className="text-[#333]" />
                <FaLinkedin className="text-[#0077b5]" />
              </div>
            </div>
            <div className="flex flex-col gap-4 text-gray-700 text-[16px] font-montserrat">
              <Link
                href="/"
                className="hover:underline hover:text-[#38B6FF] transform ease-in-out duration-200"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/market"
                className="hover:underline hover:text-[#38B6FF] transform ease-in-out duration-200"
                onClick={() => setIsOpen(false)}
              >
                Market
              </Link>
              <Link
                href="/"
                className="hover:underline hover:text-[#38B6FF] transform ease-in-out duration-200"
                onClick={() => setIsOpen(false)}
              >
                Bidding Portal
              </Link>
              <Link
                href="/aboutus"
                className="hover:underline hover:text-[#38B6FF] transform ease-in-out duration-200"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="hover:underline hover:text-[#38B6FF] transform ease-in-out duration-200"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
            </div>

            {/* <Link href="/create-account">
              <Button
                text="Create Account"
                className="text-white bg-gradient-to-r from-[#88B04B] to-[#4BAF47] opacity-80 hover:opacity-100 rounded-md px-4 py-2"
              />
            </Link> */}
          </div>
        </div>
      </nav>
    </header>
  );
}

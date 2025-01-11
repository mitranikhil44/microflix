"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWebStore } from "@/context";
import CateogryData from "./other/CateogryData";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { setProgress, setIsLoading } = useWebStore();

  const showLoading = () => {
    setProgress(30);
    setIsLoading(true);
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 flex justify-center items-center w-full z-50 transition-all duration-300 backdrop-blur-xl ${
          scrolled
            ? "bg-gradient-to-r from-orange-600 via-purple-700 to-indigo-900 bg-opacity-80 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="xl:w-[1560px] sm:w-[75%] w-full flex justify-between p-2 sm:p-4">
          {/* Logo */}
          <Link
            href="/"
            onClick={pathname !== "/" ? () => { showLoading(); scrollTop(); } : ""}
          >
            <img
              src="/logo.png"
              alt="Microflix Logo"
              className="w-36 sm:w-44 object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Search Button */}
          <button
            onClick={scrollTop}
            className={`${
              scrolled ? "opacity-100" : "opacity-0"
            } bg-purple-600 p-2 rounded-full hover:bg-purple-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition duration-300`}
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Divider */}
      <hr className="border-gray-700 mt-12" />

      {/* Category Data */}
      <CateogryData />
    </>
  );
};

export default Navbar;

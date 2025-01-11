"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWebStore } from "@/context";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { setProgress, setIsLoading } = useWebStore();

  const showLoading = () => {
    setProgress(30);
    setIsLoading(true);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-opacity-95 shadow-lg"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="xl:w-[1560px] sm:w-[75%] w-full flex justify-between items-center p-3 sm:p-4 mx-auto main-content">
          {/* Logo */}
          <Link
            href="/"
            onClick={
              pathname !== "/" ? () => {
                showLoading();
                scrollTop();
              } : null
            }
          >
            <img
              src="/logo.png"
              alt="Microflix Logo"
              className="w-36 sm:w-44 object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollTop}
            className={`${
              scrolled ? "opacity-100" : "opacity-0"
            } bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-opacity duration-300`}
            aria-label="Scroll to Top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path fillRule="evenodd" d="M1.646 11.854a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.207 2.354 11.146a.5.5 0 0 1-.708 0z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Push Content Below Navbar */}
      <div className="pt-[80px]"></div>
    </>
  );
};

export default Navbar;

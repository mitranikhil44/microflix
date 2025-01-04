"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWebStore } from "@/context";
import Logo from "@/public/logo.png";
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
    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <>
      <div className={`px-5 py-2 sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black' : 'bg-transparent'}`}>
        <div className="xl:w-[1560px] sm:w-[75%] w-full mx-auto">
          <div className="flex justify-between items-center ">
            <Link href="/" className="flex items-center" onClick={pathname != "/" ? () => { showLoading(); scrollTop(); }:""}>
              <div className="w-[80%]">
                <Image src={Logo} alt="Logo" />
              </div>
              <p className="text-yellow-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl xxl:text-3xl ml-[1rem]">
              </p>
            </Link>
            <div className="space-x-4 mr-[2%] flex justify-end items-center w-2/4" onClick={scrollTop}>
              {scrolled && (
                <div
                className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
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
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                  />
                </svg>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr/>
      <CateogryData />
    </>
  );
};

export default Navbar;

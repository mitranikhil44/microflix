"use client";

import Link from "next/link";
import Image from "next/image";
import { useWebStore } from "@/context";
import Logo from "@/user_stuffs/logo.png";
import CateogryData from "./other/CateogryData";
import { usePathname } from "next/navigation";
import CategoryData from "./other/AnimeCateogryData";

const Navbar = () => {
  const pathname = usePathname();
  const { setProgress } = useWebStore();
  const showLoading = () => {
    setProgress(30);
  };
  return (
    <>
      <div className="px-5 py-2 sticky top-0 z-50 bg-black">
        <div className="xl:w-[1560px] sm:w-[75%] w-full mx-auto">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center" onClick={showLoading}>
              <div className="w-10 xl:w-[15%] lg:w-[13%]">
                <Image src={Logo} alt="Logo" />
              </div>
              <p className="text-yellow-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl xxl:text-3xl ml-[1rem]">
                🅼🅸🅲🆁🅾🅵🅻🅸🆇
              </p>
            </Link>
            <div className="space-x-4 mr-[2%] flex justify-end items-center w-2/4">
              <Link href="/search">
                <div className="cursor-pointer hover:text-yellow-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      className="hover:text-yellow-600 text-white"
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                    />
                  </svg>
                </div>
              </Link>
              <Link href="/contact_us" passHref onClick={showLoading}>
                <div className="text-white hover:text-yellow-500 hover:underline">
                  Contact Us
                </div>
              </Link>
            </div>
          </div>
          {pathname.includes("anime_hub") ? <CategoryData/> : <CateogryData/>}
        </div>
      </div>
    </>
  );
};

export default Navbar;

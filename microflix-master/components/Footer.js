"use client";

import Link from "next/link";
import { useWebStore } from "@/context";

const Footer = () => {
  const { setProgress } = useWebStore();
  const showLoading = () => {
    setProgress(30);
  };

  return (
    <>
      <footer className="text-gray-400 body-font sticky bottom-0 left-0 text-xs xxs:text-sm lg:text-base xl:text-lg z-50 w-full bg-gray-950">
        <div className="xl:w-[1560px] sm:w-[75%] w-full mx-auto">
          <nav className="p-[2%] sm:p-[1.5%] md:p-[1%] flex gap-5 items-center justify-center">
            <div className="flex justify-center items-center flex-col cursor-pointer hover:text-yellow-500 ">
              <Link href="/" onClick={showLoading} className="flex flex-col justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-house-door-fill"
                  viewBox="0 0 16 16"
                >
                  <path className="hover:text-yellow-600 text-white" d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5Z" />
                </svg>
                Home
              </Link>
            </div>
            <Link href="/search">
              <div className="flex justify-center items-center flex-col cursor-pointer hover:text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path className="hover:text-yellow-600 text-white" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                Search
              </div>
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Footer;

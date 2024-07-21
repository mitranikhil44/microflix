"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWebStore } from "@/context";

const CateogryData = () => {
  const { setProgress } = useWebStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const showLoading = () => {
    setProgress(30);
  };

  if (!isHydrated) {
    return null; // or a loading spinner if you prefer
  }

  return (
    <div className="my-[2%] text-xs smd:text-sm">
      <div className="flex justify-center flex-wrap gap-y-2 items-center rounded-xl xs:rounded-2xl mx-auto mb-[1%] p-[1.5%] sm:p-[1%] lg:p-[0.5%]">
        <Link
          href="/data/movies"
          onClick={showLoading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-purple-700 rounded mr-2 mmd:mr-4.5 xl:mr-8"
        >
          Movies
        </Link>
        <Link
          href="/data/web_series"
          onClick={showLoading}
          className="bg-orange-500 hover:bg-orange-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-orange-700 rounded mr-2 mmd:mr-4.5 xl:mr-8"
        >
          Web Series
        </Link>
        <div className="hidden xs:block">
          <Link
            href="/data/contents"
            onClick={showLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-green-700 rounded mr-2 mmd:mr-4.5 xl:mr-8"
          >
            Contents
          </Link>
          <Link
            href="/data/adult_contents"
            onClick={showLoading}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-red-700 rounded mr-2 mmd:mr-4.5 xl:mr-8"
          >
            18+ Contents
          </Link>
        </div>

        {/* Dropdown Buttons */}

        {/* More Contents Dropdown Button */}
        <div className="relative group xs:hidden mr-2 mmd:mr-4.5 xl:mr-8">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-indigo-700 rounded-md focus:outline-none flex justify-center items-center gap-1">
            More
          </button>
          <ul className="absolute hidden overflow-hidden top-0 rounded-md bg-red-950 text-white group-hover:block z-10 w-24 xxs:w-32">
            <Link
              href="/data/contents"
              onClick={showLoading}
              className="block p-2"
            >
              Contents
            </Link>
            <Link
              href="/data/adult_contents"
              onClick={showLoading}
              className="block p-2"
            >
              18+ Contents
            </Link>
          </ul>
        </div>

        {/* Top Rated Contents Button */}
        <div className="relative group bg-transparent">
          <button className="bg-sky-500 hover:bg-sky-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-sky-700 rounded-md focus:outline-none flex justify-center items-center gap-1">
            Top Rated
          </button>
          <ul className="absolute hidden overflow-hidden top-0 rounded-md bg-red-950 text-white group-hover:block z-10 w-24 xxs:w-32">
            <Link
              href="/data/top_contents"
              onClick={showLoading}
              className="block p-2"
            >
              Top Contents
            </Link>
            <Link
              href="/data/top_adult_contents"
              onClick={showLoading}
              className="block p-2"
            >
              Top 18+ Contents
            </Link>
            <Link
              href="/data/top_movies"
              onClick={showLoading}
              className="block p-2"
            >
              Top Movies
            </Link>
            <Link
              href="/data/top_web_series"
              onClick={showLoading}
              className="block p-2"
            >
              Top TV Series
            </Link>
          </ul>
        </div>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-[2%]">
        <Link
          href="/anime_hub"
          onClick={showLoading}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-yellow-700 rounded"
        >
          Anime Hub
        </Link>
        <Link
          href="https://t.me/microflix_480p_720_1080p_movies"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-blue-700 rounded"
        >
          Join Telegram
        </Link>
      </div>
    </div>
  );
};

export default CateogryData;

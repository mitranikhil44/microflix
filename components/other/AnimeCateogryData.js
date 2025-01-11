"use client";

import React from "react";
import Link from "next/link";
import { useWebStore } from "@/context";

const CategoryData = () => {
  const { setProgress } = useWebStore();

  const showLoading = () => {
    setProgress(30);
  };

  return (
    <div className="my-4 text-xs sm:text-sm">
      {/* Main Category Buttons */}
      <div className="flex justify-center flex-wrap gap-4 items-center rounded-xl mx-auto mb-4 p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg">
        <Link
          href="/anime_hub/anime_movies"
          onClick={showLoading}
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Anime Movies
        </Link>
        <Link
          href="/anime_hub/anime_web_series"
          onClick={showLoading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Anime Web Series
        </Link>
        <Link
          href="/anime_hub/anime_contents"
          onClick={showLoading}
          className="hidden xs:block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Anime Contents
        </Link>

        {/* Dropdown for Additional Contents */}
        <div className="relative group xs:hidden">
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg flex items-center justify-center transition-transform transform hover:-translate-y-1">
            More
          </button>
          <ul className="absolute hidden overflow-hidden rounded-lg bg-gray-800 text-white group-hover:block z-10 w-32 shadow-lg mt-2">
            <Link
              href="/anime_hub/anime_contents"
              onClick={showLoading}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Anime Contents
            </Link>
          </ul>
        </div>

        {/* Top Rated Dropdown */}
        <div className="relative group">
          <button className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg flex items-center justify-center transition-transform transform hover:-translate-y-1">
            Top Rated
          </button>
          <ul className="absolute hidden overflow-hidden rounded-lg bg-gray-800 text-white group-hover:block z-10 w-40 shadow-lg mt-2">
            <Link
              href="/anime_hub/top_anime_contents"
              onClick={showLoading}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Top Anime Contents
            </Link>
            <Link
              href="/anime_hub/top_anime_movies"
              onClick={showLoading}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Top Anime Movies
            </Link>
            <Link
              href="/anime_hub/top_anime_web_series"
              onClick={showLoading}
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Top Anime TV Series
            </Link>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex justify-center flex-wrap gap-4 mt-6">
        <Link
          href="/"
          onClick={showLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Contents Hub
        </Link>
        <Link
          href="https://t.me/microflix_480p_720_1080p_movies"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Join Telegram
        </Link>
      </div>
    </div>
  );
};

export default CategoryData;

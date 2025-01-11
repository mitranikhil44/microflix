"use client"

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWebStore } from "@/context";
import Button from "@/components/other/cateogry_data/Button";
import Dropdown from "@/components/other/cateogry_data/Dropdown";
import SearchForm from "@/components/other/cateogry_data/SearchForm";

const CateogryData = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { setProgress, setIsLoading } = useWebStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setIsHydrated(true), []);

  useEffect(() => {
    if (suggestions.length > 0 && searchTerm.trim()) setIsModalOpen(true);
    else setIsModalOpen(false);
  }, [suggestions, searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`/api/search_result/?query=${query}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "reload",
      });
      const data = await response.json();
      if (Array.isArray(data.result.data)) {
        setSuggestions(data.result.data.map((item) => item.title));
      } else console.error("Invalid data format:", data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion);
    await router.push(`/search_result?query=${encodeURIComponent(suggestion.trim())}`);
    setSearchTerm("");
    setIsModalOpen(false);
    setProgress(30);
  };

  const showLoading = () => setProgress(30);

  if (!isHydrated) return null;

  return (
    <div className="text-xs sm:text-sm ">
      {/* Category Buttons Section */}
      <div className="flex flex-wrap justify-center gap-6 items-center mx-auto mb-6">
        {[
          {
            href: pathname.includes("anime_hub") ? "/anime_hub/anime_movies" : "/data/movies",
            label: `${pathname.includes("anime_hub") ? "Anime" : ""} Movies`,
            color: "from-purple-400 via-purple-500 to-purple-600",
          },
          {
            href: pathname.includes("anime_hub") ? "/anime_hub/anime_web_series" : "/data/web_series",
            label: `${pathname.includes("anime_hub") ? "Anime" : ""} TV Series`,
            color: "from-orange-400 via-orange-500 to-orange-600",
          },
          !pathname.includes("anime_hub") && {
            href: "/data/adult_contents",
            label: "18+ Contents",
            color: "from-red-400 via-red-500 to-red-600",
          },
        ]
          .filter(Boolean)
          .map(({ href, label, color }) => (
            <Button
              key={label}
              href={href}
              onClick={showLoading}
              className={`bg-gradient-to-r ${color} hover:scale-105 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform`}
            >
              {label}
            </Button>
          ))}

        {/* Dropdown for Top Rated Section */}
        <div className="relative group">
          <button className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 hover:scale-105 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform flex items-center gap-2">
            Top Rated
          </button>
          <Dropdown
            items={[
              {
                href: pathname.includes("anime_hub")
                  ? "/anime_hub/top_anime_movies"
                  : "/data/top_movies",
                label: `Top ${pathname.includes("anime_hub") ? "Anime " : ""}Movies`,
              },
              {
                href: pathname.includes("anime_hub")
                  ? "/anime_hub/top_anime_web_series"
                  : "/data/top_web_series",
                label: `Top ${pathname.includes("anime_hub") ? "Anime " : ""}TV Series`,
              },
              !pathname.includes("anime_hub") && {
                href: "/data/top_adult_contents",
                label: "Top 18+ Contents",
              },
            ].filter(Boolean)}
            className="w-40 bg-black text-white rounded-lg shadow-lg mt-2"
          />
        </div>
      </div>

      {/* Hub and Telegram Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <Button
          href={pathname.includes("anime_hub") ? "/" : "/anime_hub"}
          onClick={showLoading}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:scale-105 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform"
        >
          {pathname.includes("anime_hub") ? "Content" : "Anime"} Hub
        </Button>
        <Button
          href="https://t.me/microflix_480p_720_1080p_movies"
          className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:scale-105 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform"
        >
          Join Telegram
        </Button>
      </div>

      {/* Search Form */}
      <SearchForm
        fetchSuggestions={fetchSuggestions}
        handleSuggestionClick={handleSuggestionClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        setIsLoading={setIsLoading}
        setProgress={setProgress}
        suggestions={suggestions}
      />
    </div>
  );
};

export default CateogryData;

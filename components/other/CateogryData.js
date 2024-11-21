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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (suggestions.length > 0 && searchTerm.trim() !== "") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [suggestions, searchTerm]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`/api/search_result/?query=${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "reload",
      });
      const data = await response.json();
      if (Array.isArray(data.result.data)) {
        const titles = data.result.data.map((item) => item.title);
        setSuggestions(titles);
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion);
    const queryString = `?query=${encodeURIComponent(suggestion.trim())}`;
    await router.push(`/search_result${queryString}`);
    setSearchTerm("");
    setIsModalOpen(false);
    setProgress(30);
  };

  const showLoading = () => {
    setProgress(30);
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="my-[2%] lg:my-[1%] text-xs smd:text-sm">
      <div className="flex justify-center flex-wrap gap-y-2 items-center rounded-xl xs:rounded-2xl mx-auto mb-[1%] lg:mb-[.5%] p-[1.5%] sm:p-[1%] lg:p-[0.5%]">
        <Button
          href={`${
            pathname.includes("anime_hub")
              ? "/anime_hub/anime_movies"
              : "/data/movies"
          }`}
          onClick={showLoading}
          className="bg-purple-500 hover:bg-purple-700 text-white mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-purple-700 mr-2 mmd:mr-3 xl:mr-4"
        >
          {pathname.includes("anime_hub") ? "Anime" : ""} Movies
        </Button>
        <Button
          href={`${
            pathname.includes("anime_hub")
              ? "/anime_hub/anime_web_series"
              : "/data/web_series"
          }`}
          onClick={showLoading}
          className="bg-orange-500 hover:bg-orange-700 text-white mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-orange-700 mr-2 mmd:mr-3 xl:mr-4"
        >
          {pathname.includes("anime_hub") ? "Anime" : ""} TV Series
        </Button>
        {!pathname.includes("anime_hub") && (
          <Button
            href="/data/adult_contents"
            onClick={showLoading}
            className="bg-red-500 hover:bg-red-700 text-white mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-red-700 mr-2 mmd:mr-3 xl:mr-4"
          >
            18+ Contents
          </Button>
        )}

        <div className="relative group bg-transparent">
          <button className="bg-sky-500 text-white font-semibold xl:py-2 mmd:py-1.5 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 rounded-md group-hover:rounded-b-none group-focus:rounded-b-none flex justify-center items-center gap-1">
            Top Rated
          </button>
          <hr className="hidden group-hover:block group-focus:block" />
          <Dropdown
            items={[
              {
                href: `${
                  pathname.includes("anime_hub")
                    ? "/anime_hub/top_anime_movies"
                    : "/data/top_movies"
                }`,
                label: `Top ${
                  pathname.includes("anime_hub") ? "Anime " : ""
                }Movies`,
              },
              {
                href: `${
                  pathname.includes("anime_hub")
                    ? "/anime_hub/top_anime_web_series"
                    : "/data/top_web_series"
                }`,
                label: `Top ${
                  pathname.includes("anime_hub") ? "Anime " : ""
                }TV Series`,
              },
              ...(!pathname.includes("anime_hub")
                ? [
                    {
                      href: `/data/top_adult_contents`,
                      label: "Top 18+ Contents",
                    },
                  ]
                : []),
            ]}
            className="w-24 xxs:w-32"
          />
        </div>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-[2%] mb-[2%] lg:mb-[1%]">
        <Button
          href={pathname.includes("anime_hub") ? "/" : "/anime_hub"}
          onClick={showLoading}
          className="bg-yellow-500 hover:bg-yellow-700 text-white mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-yellow-700"
        >
          {pathname.includes("anime_hub") ? "Content" : "Anime"} Hub
        </Button>
        <Button
          href="https://t.me/microflix_480p_720_1080p_movies"
          className="bg-blue-500 hover:bg-blue-700 text-white mmd:py-2 mmd:px-4 xs:py-1 xs:px-2 py-0 px-1 border border-blue-700"
        >
          Join Telegram
        </Button>
      </div>

      <SearchForm
        fetchSuggestions={fetchSuggestions}
        handleSuggestionClick={handleSuggestionClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        setIsLoading={setIsLoading}
        setProgress={setProgress}
        suggestions={suggestions} // Make sure this is passed
      />
    </div>
  );
};

export default CateogryData;

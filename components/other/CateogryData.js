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
      <div className="flex justify-center flex-wrap gap-4 items-center rounded-xl xs:rounded-2xl mx-auto mb-4">
        <Button
          href={`${
            pathname.includes("anime_hub")
              ? "/anime_hub/anime_movies"
              : "/data/movies"
          }`}
          onClick={showLoading}
          className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:from-purple-500 hover:via-purple-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl"
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
          className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl"
        >
          {pathname.includes("anime_hub") ? "Anime" : ""} TV Series
        </Button>
        {!pathname.includes("anime_hub") && (
          <Button
            href="/data/adult_contents"
            onClick={showLoading}
            className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl"
          >
            18+ Contents
          </Button>
        )}

        <div className="relative group bg-transparent">
          <button className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 hover:from-sky-500 hover:via-sky-600 hover:to-sky-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl flex justify-center items-center gap-2">
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
            className="w-32 bg-black rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="flex justify-center flex-wrap items-center gap-4 mb-6 lg:mb-4">
        <Button
          href={pathname.includes("anime_hub") ? "/" : "/anime_hub"}
          onClick={showLoading}
          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl"
        >
          {pathname.includes("anime_hub") ? "Content" : "Anime"} Hub
        </Button>
        <Button
          href="https://t.me/microflix_480p_720_1080p_movies"
          className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl"
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
        suggestions={suggestions}
      />
    </div>
  );
};

export default CateogryData;

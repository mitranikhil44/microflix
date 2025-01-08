"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import defaultLogo from "@/public/logo2.png";
import ResultedContent from "@/components/other/ResultedContent";
import { useSearchParams } from "next/navigation";
import { useWebStore } from "@/context";

const SearchResult = ({ params }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const { setProgress, setIsLoading } = useWebStore();
  const [contents, setContents] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [page] = useState(params.page);
  const limit = 12;

  // Fetches data from the API
  const fetchMoreData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/search_result/?query=${query}&page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (Array.isArray(data.result.data)) {
        setContents(data.result.data);
        setTotalData(data.result.totalData);
      } else {
        console.error(
          "Fetched data does not contain an array of contents:",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  useEffect(() => {
    fetchMoreData();
    setIsLoading(false);
    setProgress(100);
  }, [query]);

  const showLoading = () => {
    setIsLoading(true);
  };

  // Calculates total pages based on total data and limit per page
  const totalPages = Math.floor(totalData / limit);

  // Function to get the appropriate image source
  const getImageSource = (element) => {
    const image = element.image;

    // If image is null, empty, or does not start with 'https://', return IMDb image or default logo
    if (!image || !image.startsWith("https://")) {
      if (element.imdbDetails && element.imdbDetails.imdbPosterLink) {
        const posterLinks = element.imdbDetails.imdbPosterLink;
        // Check if posterLinks is an array and not empty
        if (Array.isArray(posterLinks) && posterLinks.length > 0) {
          // Return the last poster link URL
          return posterLinks[posterLinks.length - 1].url;
        }
      }
      return defaultLogo;
    }

    const imageUrl = encodeURIComponent(image);
    const proxyUrl = `/api/image-proxy?url=${imageUrl}`;

    // Check if IMDb details are available and contain poster links
    if (element.imdbDetails && element.imdbDetails.imdbPosterLink) {
      const posterLinks = element.imdbDetails.imdbPosterLink;
      // Check if posterLinks is an array and not empty
      if (Array.isArray(posterLinks) && posterLinks.length > 0) {
        // Return the last poster link URL
        return posterLinks[posterLinks.length - 1].url;
      }
    }

    // Check if element has a custom image
    if (proxyUrl) {
      if (proxyUrl.includes("https://gogocdn.net")) {
        return proxyUrl.replace("https://ww5.gogoanimes.fi", "");
      }

      // Handle vegamovies domain replacements
      const vegamoviesPatterns = [
        { old: "m.vegamovies.yt", new: "vegamovies.tw" },
        { old: "vegamovies.yt", new: "vegamovies.tw" },
        { old: "//vegamovies.mex.com", new: "https://vegamovies.tw" },
      ];

      for (const pattern of vegamoviesPatterns) {
        if (proxyUrl.includes(pattern.old)) {
          return proxyUrl.replace(pattern.old, pattern.new);
        }
      }

      return proxyUrl;
    }

    // If no custom image or IMDb poster links available, return default logo
    return defaultLogo;
  };

  // Transforms specific image URLs based on conditions
  // const transformImageUrl = (imageUrl) => {
  //   if (imageUrl.includes("https://gogocdn.net")) {
  //     return imageUrl.replace("https://ww5.gogoanimes.fi", "");
  //   }
  //   if (imageUrl.includes("m.vegamovies.yt")) {
  //     return imageUrl.replace("m.vegamovies.yt", "vegamovies.ist");
  //   }
  //   if (imageUrl.includes("vegamovies.yt")) {
  //     return imageUrl.replace("vegamovies.yt", "vegamovies.ist");
  //   }
  //   if (imageUrl.includes("vegamovies.mex.com")) {
  //     return imageUrl.replace("//vegamovies.mex.com", "https://vegamovies.ist");
  //   }
  //   if (imageUrl.includes("vegamovies.ph")) {
  //     return imageUrl.replace("vegamovies.ph", "vegamovies.ist");
  //   }
  //   return imageUrl; // No transformation needed
  // };

  // Determines the color for rating based on IMDb rating
  const getRatingColor = (rating) => {
    const imdbRating = rating ? parseFloat(rating) : 0;
    switch (true) {
      case imdbRating >= 9:
        return "bg-green-800";
      case imdbRating >= 8:
        return "bg-green-500";
      case imdbRating >= 7:
        return "bg-yellow-700";
      case imdbRating >= 6:
        return "bg-orange-700";
      case imdbRating >= 5:
        return "bg-orange-500";
      case imdbRating >= 4:
        return "bg-red-500";
      case imdbRating >= 3:
        return "bg-red-800";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="mt-[2%]">
        <h1 className="text-base">
          <strong>Content Results for: </strong>
          {query}
        </h1>
        <p>
          <strong>Total Result is:</strong> {totalData}
        </p>
        <div className="grid grid-cols-2 mt-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {contents.map((element, index) => (
            <Link
              key={index + 1}
              href={`/${
                element.title.includes("Download") ? "data" : "anime_hub"
              }/${element.slug}${
                element.title.includes("Download") ? "" : "/0/1"
              }`}
              className="hover:scale-95 border-solid border-2 border-yellow-600 rounded-lg"
              onClick={showLoading}
              passHref
            >
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out">
                <div className="relative overflow-hidden flex items-center justify-center">
                  <img
                    width={144}
                    height={144}
                    src={getImageSource(element)}
                    alt={element.title.replace(/Download/, "").trim()}
                    className="object-cover hover:scale-110 overflow-hidden rounded-lg w-auto h-auto"
                  />
                  <div
                    className={`absolute top-0 left-0 p-1 font-bold text-sm bg-opacity-50 rounded-tl-md ${getRatingColor(
                      element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.rating != null
                          ? element.imdbDetails.imdbRating.rating
                          : 0
                        : 0
                    )}`}
                  >
                    <p>
                      {element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.rating != null
                          ? element.imdbDetails.imdbRating.rating
                          : 0
                        : 0}
                    </p>
                    <p>
                      {element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.votes != null
                          ? element.imdbDetails.imdbRating.votes
                          : 0
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center mt-2">
                  <h4 className="text-xs md:text-sm font-semibold mb-2">
                    {element.title}
                  </h4>
                  <p className="text-sky-600">Year: {element.releaseYear}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <ResultedContent totalPages={totalPages} query={query} page={page} />
      </div>
    </div>
  );
};

export default function Searchbar({ params }) {
  return (
    <Suspense>
      <SearchResult params={params} />
    </Suspense>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import defaultLogo from "@/user_stuffs/logo.png";
import ResultedContent from "@/components/other/ResultedContent";
import { useSearchParams } from "next/navigation";
import { useWebStore } from "@/context";

const SearchResult = ({params}) => {
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
      const response = await fetch(`/api/search_result/?query=${query}&page=${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (Array.isArray(data.result.data)) {
        setContents(data.result.data);
        setTotalData(data.result.totalData);
      } else {
        console.error("Fetched data does not contain an array of contents:", data);
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
  }, [query]); 

  // Calculates total pages based on total data and limit per page
  const totalPages = Math.floor(totalData / limit);

  // Resolves image source for each element
  const getImageSource = (element) => {
    const { image, imdbDetails } = element;

    if (image) {
      // Handle specific image URL transformations
      const transformedImage = transformImageUrl(image);
      if (transformedImage) return transformedImage;
    }

    // Fallback to IMDb poster link if available
    if (imdbDetails && imdbDetails.imdbPosterLink) {
      const posterLinks = imdbDetails.imdbPosterLink;
      if (Array.isArray(posterLinks) && posterLinks.length > 0) {
        return posterLinks[posterLinks.length - 1].url;
      }
    }

    return defaultLogo; // Fallback to default logo if no suitable image found
  };

  // Transforms specific image URLs based on conditions
  const transformImageUrl = (imageUrl) => {
    if (imageUrl.includes("https://gogocdn.net")) {
      return imageUrl.replace("https://ww5.gogoanimes.fi", "");
    }
    if (imageUrl.includes("m.vegamovies.yt")) {
      return imageUrl.replace("m.vegamovies.yt", "vegamovies.ist");
    }
    if (imageUrl.includes("vegamovies.yt")) {
      return imageUrl.replace("vegamovies.yt", "vegamovies.ist");
    }
    if (imageUrl.includes("vegamovies.mex.com")) {
      return imageUrl.replace("//vegamovies.mex.com", "https://vegamovies.ist");
    }
    if (imageUrl.includes("vegamovies.ph")) {
      return imageUrl.replace("vegamovies.ph", "vegamovies.ist");
    }
    return imageUrl; // No transformation needed
  };

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
          <strong>Movie Results for: </strong>
          {query}
        </h1>
        <p>
          <strong>Total Result is:</strong> {totalData}
        </p>
        <div className="grid grid-cols-2 mt-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {contents.map((element, index) => (
            <Link
              key={index + 1}
              href={`/${element.title.includes("Download") ? "data" : "anime_hub"}/${element.slug}${element.title.includes("Download") ? "" : "/0/1"}`}
              passHref
            >
              <div className="p-4 to-black relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out">
                <div className="relative overflow-hidden flex items-center justify-center">
                  <Image
                    width={144}
                    height={144}
                    src={getImageSource(element)}
                    alt={element.title.replace(/Download/, "").trim()}
                    className="object-cover hover:scale-110 overflow-hidden rounded-lg w-auto h-auto"
                    style={{ clipPath: "polygon(0 10%, 100% 10%, 100% 100%, 0% 100%)" }}
                  />
                  <div
                    className={`absolute top-0 left-0 p-1 font-bold text-sm bg-opacity-50 rounded-tl-md ${getRatingColor(element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.rating != null ? element.imdbDetails.imdbRating.rating : 0 : 0)}`}
                  >
                    <p>
                      {element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.rating != null ? element.imdbDetails.imdbRating.rating : 0 : 0}
                    </p>
                    <p>
                      {element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.votes != null ? element.imdbDetails.imdbRating.votes : 0 : 0}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center text-center mt-2">
                  <h4 className="text-xs md:text-sm font-semibold mb-2">
                    {element.title}
                  </h4>
                  <p className="text-gray-600">Year: {element.releaseYear}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <ResultedContent cateogry="search_result" totalPages={totalPages} query={query} page={page} />
      </div>
    </div>
  );
};

export default function Searchbar({params}) {
  return (
    <Suspense>
      <SearchResult params={params}/> 
    </Suspense>
  )
}
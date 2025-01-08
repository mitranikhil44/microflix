"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import defaultLogo from "@/public/logo2.png";
import { useWebStore } from "@/context";

const ContentList = ({ contents }) => {
  const { setProgress, setIsLoading } = useWebStore();
  const showLoading = () => {
    setProgress(30);
    setIsLoading(true);
  };

  useEffect(() => {
    setIsLoading(false);
    setProgress(100);
  }, []);

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

  if (
    !contents ||
    !contents[0] ||
    !contents[0].data ||
    contents[0].data.length === 0
  ) {
    return (
      <div className="text-center mt-8">
        <p>No content available.</p>
      </div>
    );
  }

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
    
    // Check if element has a custom image
    if (proxyUrl) {
        if (proxyUrl.includes("https://gogocdn.net")) {
            return proxyUrl.replace("https://ww5.gogoanimes.fi", "");
        }

        // Handle vegamovies domain replacements
        const vegamoviesPatterns = [
            { old: "m.vegamovies.yt", new: "vegamovies.ms" },
            { old: "vegamovies.yt", new: "vegamovies.ms" },
            { old: "//vegamovies.mex.com", new: "https://vegamovies.ms" },
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


  return (
    <>
    {!contents ? <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse bg-white h-20 w-20 rounded-full"></div>
        </div>
        : ""}
        <div className="grid grid-cols-2 mt-4 gap-2 llg:gap-4 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {contents[0].data.map((element, index) => (
            <Link
              key={index + 1}
              href={`/data/${element.slug}`}
              onClick={showLoading}
              className="hover:scale-95 border-solid border-2 border-yellow-600 rounded-lg"
            >
              <div className="to-black relative overflow-hidden  shadow-lg cursor-pointer transition-transform duration-300 ease-in-out rounded-t-lg">
                <div className="relative overflow-hidden flex items-center justify-center">
                  <img
                    width={144}
                    height={144}
                    src={getImageSource(element)}
                    alt={element.title.replace(/Download/, "").trim()}
                    className="object-cover overflow-hidden -mt-[20%] w-full h-full"
                    style={{
                      clipPath: "polygon(0 10%, 100% 10%, 100% 100%, 0% 100%)",
                    }}
                  />
                  <div
                    className={`IMDB rounded-tl-lg absolute top-0 left-0 p-1 text-xs md:text-sm text-white bg-opacity-50 ${getRatingColor(
                      element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.rating
                          ? element.imdbDetails.imdbRating.rating
                          : 0
                        : 0
                    )}`}
                  >
                    <p>
                      Rating:{" "}
                      {element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.rating
                          ? element.imdbDetails.imdbRating.rating
                          : 0
                        : 0}
                    </p>
                    <p>
                      {" "}
                      Votes:{" "}
                      {element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.votes
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
                  <p className="text-gray-300">Year: {element.releaseYear}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>        
    </>
  );
};

export default ContentList;

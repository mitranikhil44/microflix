"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import defaultLogo from "@/user_stuffs/logo.png";
import { useWebStore } from "@/context";

const ContentList = ({ contents }) => {
  const { setProgress, setIsLoading } = useWebStore();
  const showLoading = () => {
    setProgress(30);
    setIsLoading(true);
  };

  useEffect(() => {
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

    // Check if element has a custom image
    if (image) {
      if (image.includes("https://gogocdn.net")) {
        return image.replace("https://ww5.gogoanimes.fi", "");
      }

      // Handle vegamovies domain replacements
      const vegamoviesPatterns = [
        { old: "m.vegamovies.yt", new: "vegamovies.tw" },
        { old: "vegamovies.yt", new: "vegamovies.tw" },
        { old: "//vegamovies.mex.com", new: "https://vegamovies.tw" },
      ];

      for (const pattern of vegamoviesPatterns) {
        if (image.includes(pattern.old)) {
          return image.replace(pattern.old, pattern.new);
        }
      }

      return image;
    }

    // Check if IMDb details are available and contain poster links
    if (element.imdbDetails && element.imdbDetails.imdbPosterLink) {
      const posterLinks = element.imdbDetails.imdbPosterLink;
      // Check if posterLinks is an array and not empty
      if (Array.isArray(posterLinks) && posterLinks.length > 0) {
        // Return the last poster link URL
        return posterLinks[posterLinks.length - 1].url;
      }
    }

    // If no custom image or IMDb poster links available, return default logo
    return defaultLogo;
  };

  return (
    <div>
      <div>
        <div className="grid grid-cols-2 mt-4 gap-2 llg:gap-4 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {contents[0].data.map((element, index) => (
            <Link
              key={index + 1}
              href={`/anime_hub/${element.slug}/0/1`}
              onClick={showLoading}
              className="p-[2%] hover:scale-110"
            >
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out">
                <div className="relative overflow-hidden flex items-center justify-center">
                  <Image
                    width={144}
                    height={144}
                    src={getImageSource(element)}
                    alt={element.title.replace(/Download/, "").trim()}
                    className="object-cover hover:scale-110 overflow-hidden rounded-lg -mt-[20%] w-full h-full"
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
                  <p className="text-gray-600">Year: {element.releaseYear}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentList;

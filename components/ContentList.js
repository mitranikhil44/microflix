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
    if (!element) return defaultLogo; // Ensure element exists
  
    // Replace domain in image URL if applicable
    let image = element.image
  
    // If image is invalid, check IMDb poster links
    if (!image || !image.startsWith("https://")) {
      if (element.imdbDetails?.imdbPosterLink) {
        const posterLinks = element.imdbDetails.imdbPosterLink;
  
        // Check if posterLinks is a valid non-empty array
        if (Array.isArray(posterLinks) && posterLinks.length > 0) {
          return posterLinks[posterLinks.length - 1]?.url || defaultLogo;
        }
      }
      return defaultLogo;
    }
  
    // Encode image URL to prevent issues
    const imageUrl = encodeURIComponent(image);
    let proxyUrl = `/api/image-proxy?url=${imageUrl}`;
  
    // If proxy URL is valid, apply domain replacements
    if (proxyUrl) {
      if (proxyUrl.includes("https://gogocdn.net")) {
        proxyUrl = proxyUrl.replace("https://ww5.gogoanimes.fi", "");
      }
  
      // Handle VegaMovies domain replacements
      const vegamoviesPatterns = [
        { old: "m.vegamovies.yt", new: "vegamovies.ms" },
        { old: "vegamovies.yt", new: "vegamovies.ms" },
        { old: "rogmovies.com", new: "rogmovies.cfd" },
        { old: "vegamovies.nz", new: "vegamovies.ms" },
        { old: "//vegamovies.mex.com", new: "https://vegamovies.ms" },
        { old: "vegamovies.ms", new: "vegamovies.rs" },
      ];
  
      vegamoviesPatterns.forEach(({ old, new: newDomain }) => {
        if (proxyUrl.includes(old)) {
          proxyUrl = proxyUrl.replace(old, newDomain);
        }
      });
  
      return proxyUrl;
    }
  
    return defaultLogo;
  };  

  return (
    <>
      {!contents ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse bg-white h-20 w-20 rounded-full"></div>
        </div>
      ) : (
        ""
      )}
      <div className="grid grid-cols-2 mt-4 gap-2 llg:gap-4 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden pb-8">
        {contents[0].data.map((element, index) => (
          <Link
            key={index + 1}
            href={`/data/${element.slug}`}
            onClick={showLoading}
            className="hover:scale-95 border-solid border-2 border-yellow-600 relative flex justify-center shadow-xl rounded-lg"
          >
            <div className="to-black overflow-hidden  shadow-lg cursor-pointer transition-transform duration-300 ease-in-out rounded-t-lg">
              <div className="relative overflow-hidden flex items-center justify-center">
                <img
                  width={144}
                  height={144}
                  src={getImageSource(element)}
                  alt={element.title.replace(/Download/, "").trim()}
                  className="relative object-cover overflow-hidden -mt-[20%] w-full h-full"
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
              <div className="flex flex-col justify-center items-center text-center my-2 p-[2%]">
                <h4 className="text-xs md:text-sm font-semibold mb-4">
                  {element.title}
                </h4>
                <p className="text-gray-600">{element.releaseDate}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default ContentList;

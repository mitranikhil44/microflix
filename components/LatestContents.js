"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import React from "react";
import { useWebStore } from "@/context";
import { Swiper, SwiperSlide } from "swiper/react";
import defaultLogo from "@/user_stuffs/logo.png";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

const LatestContents = ({ data, movieLink, url }) => {
  const { setProgress, setIsLoading } = useWebStore();
  const showLoading = () => {
    setProgress(30);
    setIsLoading(true)
  };

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
    <div className="relative h-auto">
      <Link
        href={`/${url}/${movieLink}`}
        onClick={showLoading}
        className="flex underline cursor-pointer hover:text-white hover:no-underline items-center text-yellow-600"
      >
        <h2 className="text-yellow-600 hover:text-white xxl:text-3xl xl:text-2xl lg:text-xl smd:text-lg text-base font-semibold my-4">
          {movieLink === "latest_anime_contents"
            ? "Latest Anime Contents"
            : "Latest Contents"}
        </h2>
        <svg
          className="w-4 h-4 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 8 14"
        >
          <path
            className="text-yellow-600 dark:text-yellow-600 hover:text-white"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
          />
        </svg>
      </Link>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 1 },
          600: { slidesPerView: 2, spaceBetween: 5 },
          756: { slidesPerView: 3, spaceBetween: 10 },
          1080: { slidesPerView: 4, spaceBetween: 15 },
          1560: { slidesPerView: 5, spaceBetween: 20 },
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        watchSlidesProgress={true}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, EffectCoverflow, Pagination]}
        className="mySwiper"
      >
        {data &&
          data.map((element, index) => (
            <SwiperSlide key={element._id}>
              <Link
                href={`/${url}/${element.slug}${
                  url === "anime_hub" ? "/0/1" : ""
                }`}
                onClick={showLoading}
                className="h-auto"
              >
                <div className="absolute bottom-0 p-[2%] z-10 text-xs bg-black bg-opacity-70">
                  <div className="text" data-swiper-parallax="-100">
                    <p>{element.title.replace(/Download/, "").trim()}</p>
                  </div>
                  <div className="title" data-swiper-parallax="-200">
                    <div className="flex items-center">
                      <p className="mr-2">Rating:</p>
                      <p
                        className={`rounded px-2 py-1 text-xs ${getRatingColor(
                          element.imdbDetails && element.imdbDetails.imdbRating
                            ? element.imdbDetails.imdbRating.rating
                              ? element.imdbDetails.imdbRating.rating
                              : 0
                            : 0
                        )}`}
                      >
                        {element.imdbDetails && element.imdbDetails.imdbRating
                          ? element.imdbDetails.imdbRating.rating
                            ? element.imdbDetails.imdbRating.rating
                            : 0
                          : 0}
                      </p>
                    </div>
                    <p className="text-xs">
                      Votes:{" "}
                      {element.imdbDetails && element.imdbDetails.imdbRating
                        ? element.imdbDetails.imdbRating.votes
                          ? element.imdbDetails.imdbRating.votes
                          : 0
                        : 0}
                    </p>
                  </div>
                </div>
                <div className="h-full">
                  <img
                    src={getImageSource(element)}
                    className="w-full h-full object-contain clip-path -mt-[20%] box-content"
                    alt={element.title.replace(/Download/, "").trim()}
                    width={240}                    
                    style={{
                      clipPath: "polygon(0 10%, 100% 10%, 100% 100%, 0% 100%)",
                    }}
                    height={240}
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default LatestContents;

"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import defaultLogo from "@/user_stuffs/logo.png";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { useWebStore } from "@/context";
import { useEffect } from "react";

const MoviesCollection = ({ data, collectionName, movieLink, url }) => {
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

  const lastImg = (urls) => {
    if (urls && urls.length > 0) {
      return urls[urls.length - 1].url;
    } else {
      return defaultLogo;
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
    <>
      <div>
        <Link
          href={`/${url}/${movieLink}${
            url === "anime_hub" ? "/0/1" : ""
          }`}
          onClick={showLoading}
          className="flex underline cursor-pointer hover:text-white hover:no-underline items-center text-yellow-600"
        >
          <h2 className="text-yellow-600 hover:text-white xxl:text-3xl xl:text-2xl lg:text-xl smd:text-lg text-base font-semibold my-4">
            {collectionName}
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
      </div>
      <div>
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            200: { slidesPerView: 1 },
            320: { slidesPerView: 2 },
            540: { slidesPerView: 3 },
            880: { slidesPerView: 4 },
            1100: { slidesPerView: 5 },
            1300: { slidesPerView: 6 },
            1600: { slidesPerView: 8 },
          }}
          modules={[Autoplay, FreeMode, Pagination]}
          className="mySwiper"
        >
          {data &&
            data.map((element, index) => (
              <SwiperSlide key={index} onClick={showLoading}>
                <Link href={`/${url}/${element.slug}${
            url === "anime_hub" ? "/0/1" : ""
          }`}>
                  <div className="flex flex-col justify-center w-[144px] m-auto items-center hover:scale-105 cursor-pointer">
                    <div className="relative h-60 -z-10">
                      <img
                        width={144}
                        height={144}
                        src={getImageSource(element)}
                        alt={element.title.replace(/Download/, "").trim()}
                        className="hover:scale-95 rounded-lg w-full h-full clip-path -mt-[20%] vignette"
                      />

                      <div
                        className={`absolute top-0 left-0 p-1 font-bold text-sm bg-opacity-50 rounded-tl-md ${getRatingColor(
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
                    <p className="z-50 text-center font-light text-xs -mt-[10%] md:text-sm ">
                      {element.title}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default MoviesCollection;

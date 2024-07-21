"use client";

import Link from "next/link";
import { useWebStore } from "@/context";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const StreamVideo = ({ content, slug, currentEpisodeNo, currentPageNo }) => {  
  const [episodes, setEpisodes] = useState(content.contentLinkData);
  const [currentPage, setCurrentPage] = useState(currentPageNo);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const { setProgress, setIsLoading } = useWebStore();
  const router = useRouter();
  const episodesPerPage = 10;

  useEffect(() => {
    setIsLoading(false);
    if (episodes.length > 0) {
      setCurrentEpisode(episodes[currentEpisodeNo - 1]);
    }
  }, [currentEpisodeNo, episodes]);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleEpisodeClick = (episode) => {
    setCurrentEpisode(episode);
    router.push(`/anime_hub/${slug}/${currentPage}/${episode.episodeNo}`);
  };

  const handleNavigation = (direction) => {
    const index = currentEpisode.episodeNo;
    const newIndex = direction === "next" ? index + 1 : index - 1;
    if (newIndex >= 0 && newIndex < episodes.length) {
      setProgress(30);
      setIsLoading(true);
      const fixedCurrentPage = newIndex % 10 ? newIndex : newIndex -1;
      const newCurrentPage = Math.floor(fixedCurrentPage / episodesPerPage);
      const newCurrentEpisodeNo = newIndex;
      router.push(
        `/anime_hub/${slug}/${newCurrentPage}/${newCurrentEpisodeNo}`
      );
    }
  };

  const isPreviousDisabled = () =>
    episodes.findIndex((e) => e === currentEpisode) === 0;
  const isNextDisabled = () =>
    episodes.findIndex((e) => e === currentEpisode) === episodes.length - 1;

  const currentEpisodes = episodes.slice(
    currentPage * episodesPerPage,
    (currentPage + 1) * episodesPerPage
  );

  return (
    <div className="text-xs sm:text-sm lg:text-base 2xl:text-xl">
      <div className="flex justify-center items-center mb-[2%]">
        <Link href={currentEpisode?.downloadLink || "#"}>
          <button
            className="bg-red-500 hover:bg-red-400 text-red-800 font-bold mmd:py-2 mmd:px-4 py-1 px-2 rounded inline-flex items-center"
            disabled={!currentEpisode}
          >
            <svg
              className="fill-current w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Download Episode</span>
          </button>
        </Link>
      </div>
      <div className="aspect-video">
        <iframe
          className="h-full w-full rounded-lg text-white"
          src={currentEpisode?.downloadableLinks[0]?.link || ""}
          width="100%"
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-2">
        {currentEpisode &&
          currentEpisode.downloadableLinks.map((server, index) => (
            <button
              key={index}
              onClick={() => handleEpisodeClick(currentEpisode)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold mmd:py-2 mmd:px-4 py-1 px-2 rounded focus:outline-none focus:shadow-outline my-[1%] sm:my-[2%]"
            >
              {server.name}
            </button>
          ))}
      </div>
      <div className="flex justify-between items-center my-[1%] mb-[2%] sm:my-[2%]">
        {!isPreviousDisabled() && currentEpisode && (
          <button
          type="button"
          className="py-1 px-2 sm:py-1.5 sm:px-3 mmd:py-2 mmd:px-4 inline-flex items-center gap-x-2  font-semibold rounded-lg border border-teal-500 text-teal-500 hover:border-teal-400 hover:text-teal-400 disabled:opacity-50 disabled:pointer-events-none text-xs sm:text-sm lg:text-base 2xl:text-xl"
          onClick={() => handleNavigation("previous")}
          disabled={!currentEpisode || isPreviousDisabled()}
          >
            Previous (E {currentEpisode?.episodeNo - 1})
          </button>
        )}
        {!isNextDisabled() && currentEpisode && (
          <button
          type="button"
          className="py-1 px-2 sm:py-1.5 sm:px-3 mmd:py-2 mmd:px-4 inline-flex items-center gap-x-2  font-semibold rounded-lg border border-yellow-500 text-yellow-500 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50 disabled:pointer-events-none text-xs sm:text-sm lg:text-base 2xl:text-xl"
          onClick={() => handleNavigation("next")}
          disabled={!currentEpisode || isNextDisabled()}
          >
            Next (E {currentEpisode.episodeNo + 1})
          </button>
        )}
      </div>
        <hr />
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-2 xxs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-4">
          {currentEpisodes.map((episode, index) => (
            <div
              key={episode.episodeNo}
              className="border border-gray-200 mmd:py-2 mmd:px-4 py-1 px-2 rounded-md cursor-pointer text-center"
              onClick={() => handleEpisodeClick(episode)}
            >
              <h3 className="text-xs sm:text-sm lg:text-base 2xl:text-xl font-bold">E {episode.episodeNo}</h3>
            </div>
          ))}
        </div>
        <div className="mt-[4%] flex justify-center">
          <ReactPaginate
            pageCount={Math.ceil(episodes.length / episodesPerPage)}
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            containerClassName="pagination flex justify-center items-center"
            activeClassName="active"
            pageClassName="mx-2 cursor-pointer bg-gray-500 px-2 rounded-lg"
            previousClassName="mx-2 cursor-pointer bg-gray-500 px-2 rounded-lg"
            nextClassName="mx-2 cursor-pointer bg-gray-500 px-2 rounded-lg"
            previousLabel="Previous"
            nextLabel="Next"
            breakClassName="..."
            forcePage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StreamVideo;

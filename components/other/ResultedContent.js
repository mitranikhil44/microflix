"use client";

import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import { useWebStore } from "@/context";

export default function PaginationButton({ totalPages, page, query }) {
  const { setProgress, setIsLoading } = useWebStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (selectedPage) => {
    setProgress(25);
    setIsLoading(true);
    const newPageNo = selectedPage.selected + 1;
    setCurrentPage(newPageNo);
    router.push(`/search_result/page/${newPageNo}/?query=${query}`);
  };

  return (
    <div className="my-8 text-sm">
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={1}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-center items-center gap-2 mt-4"
          pageClassName="cursor-pointer bg-white text-gray-800 hover:bg-yellow-400 hover:text-white font-medium px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full shadow-md transition duration-300 ease-in-out"
          previousClassName="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full shadow-md transition duration-300 ease-in-out"
          nextClassName="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full shadow-md transition duration-300 ease-in-out"
          breakClassName="text-gray-500 font-medium"
          activeClassName="bg-yellow-500 text-white"
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          disabledClassName="opacity-50 cursor-not-allowed"
          forcePage={currentPage}
        />
      )}
    </div>
  );
}

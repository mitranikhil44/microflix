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
          containerClassName="pagination flex justify-center items-center gap-2"
          activeClassName="active"
          pageClassName="cursor-pointer bg-gray-200 text-gray-800 font-medium hover:bg-yellow-500 hover:text-white px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full transition duration-300 ease-in-out"
          previousClassName="cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-700 px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full transition duration-300 ease-in-out"
          nextClassName="cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-700 px-2 py-1 xxs:px-3 xxs:py-1.5 xs:px-4 xs:py-2 rounded-full transition duration-300 ease-in-out"
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          breakClassName="text-blue-500 font-medium"
          activeLinkClassName="bg-yellow-500 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
          forcePage={currentPage}
        />
      )}
    </div>
  );
}

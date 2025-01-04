"use client";

import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";

export default function PaginationButton({ cateogry, totalPages, page }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (selectedPage) => {
    const newPageNo = selectedPage.selected + 1;
    setCurrentPage(newPageNo);
    router.push(`/anime_hub/${cateogry}/page/${newPageNo}`);
  };

  return (
    <div className="my-8 flex justify-center">
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          containerClassName="pagination flex justify-center items-center gap-2"
          activeClassName="active"
          pageClassName="mx-1 cursor-pointer bg-gray-200 text-gray-800 font-medium hover:bg-yellow-500 hover:text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
          previousClassName="mx-1 cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-700 px-4 py-2 rounded-full transition duration-300 ease-in-out"
          nextClassName="mx-1 cursor-pointer bg-blue-500 text-white font-medium hover:bg-blue-700 px-4 py-2 rounded-full transition duration-300 ease-in-out"
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          breakClassName="mx-1 text-blue-500 font-medium"
          activeLinkClassName="bg-yellow-500 text-white"
          disabledClassName="opacity-50 cursor-not-allowed"
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}

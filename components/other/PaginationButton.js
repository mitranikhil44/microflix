"use client"

import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

export default function PaginationButton({ cateogry, totalPages, page }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (selectedPage) => {
    const newPageNo = selectedPage.selected + 1;
    setCurrentPage(newPageNo);
    router.push(`/data/${cateogry}/page/${newPageNo}`);
  };

  return (
    <div className="mt-8 text-sm">
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
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
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
}

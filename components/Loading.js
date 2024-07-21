import React from "react";

const LoadingSpinner = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gray-900 bg-opacity-70 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="mt-[2%]">Please Wait...</p>
      </div>
    </>
  );
};

export default LoadingSpinner;

import React, { useCallback } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

const SearchForm = ({
  fetchSuggestions,
  handleSuggestionClick,
  searchTerm,
  setSearchTerm,
  isModalOpen,
  closeModal,
  setIsLoading,
  setProgress,
  suggestions,
}) => {
  const router = useRouter();

  // Handle input changes
  const handleInputChange = useCallback(async (e) => {
    setIsLoading(true);
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    fetchSuggestions(newSearchTerm);
    setIsLoading(false);
  }, [fetchSuggestions, setIsLoading, setSearchTerm]);

  // Handle form submission
  const submit = useCallback(async (e) => {
    setIsLoading(true);
    e.preventDefault(); 
    if (searchTerm.trim() !== "") {
      await pushData();
    }
    setIsLoading(false);
  }, [searchTerm, setIsLoading]);

  // Push data and navigate to results page
  const pushData = async () => {
    const queryString = `?query=${encodeURIComponent(searchTerm.trim())}`;
    await router.push(`/search_result${queryString}`);
    setSearchTerm(""); 
    closeModal(); 
    setProgress(30); 
  };

  return (
    <form onSubmit={submit} className="w-full xs:w-[70%] sm:w-[60%] lg:w-[50%] mx-auto">
      <div className="relative mx-[2%] sm:m-0">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search here"
          className="w-full border border-gray-300 rounded-3xl py-[2%] px-[4%] smd:px-[3%] lg:py-[1%]"
        />
        <button
          type="submit"
          className="cursor-pointer absolute top-[25%] smd:top-[28%] lg:top-[25%] right-[3%] hover:text-yellow-500"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              className="hover:text-yellow-600 text-white"
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>
        </button>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="max-h-[300px] overflow-y-auto">
            {Array.isArray(suggestions) && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left py-2 px-4 hover:bg-gray-200"
                >
                  {suggestion}
                </button>
              ))
            ) : (
              <div className="p-4 text-center">No suggestions available</div>
            )}
          </div>
        </Modal>
      )}
    </form>
  );
};

export default SearchForm;

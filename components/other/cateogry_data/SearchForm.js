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
  const handleInputChange = useCallback(
    async (e) => {
      setIsLoading(true);
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
      fetchSuggestions(newSearchTerm);
      setIsLoading(false);
    },
    [fetchSuggestions, setIsLoading, setSearchTerm]
  );

  // Handle form submission
  const submit = useCallback(
    async (e) => {
      setIsLoading(true);
      e.preventDefault();
      if (searchTerm.trim() !== "") {
        await pushData();
      }
      setIsLoading(false);
    },
    [searchTerm, setIsLoading]
  );

  // Push data and navigate to results page
  const pushData = async () => {
    const queryString = `?query=${encodeURIComponent(searchTerm.trim())}`;
    await router.push(`/search_result${queryString}`);
    setSearchTerm("");
    closeModal();
    setProgress(30);
  };

  return (
    <form onSubmit={submit} className="w-full xs:w-3/4 sm:w-2/3 lg:w-1/2 mx-auto">
      <div className="relative mx-4 sm:mx-0">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search for your favorite content..."
          className="w-full border bg-white border-gray-500 rounded-full py-3 px-5 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md transition"
        />
        <button
          type="submit"
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white p-2.5 sm:p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>
        </button>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="max-h-72 overflow-y-auto bg-white shadow-lg rounded-md p-4">
            {Array.isArray(suggestions) && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md transition"
                >
                  {suggestion}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No suggestions available</div>
            )}
          </div>
        </Modal>
      )}
    </form>
  );
};

export default SearchForm;

"use client"

import Modal from '@/components/Modal';
import { useWebStore } from "@/context";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const Search = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { setProgress, setIsLoading } = useWebStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
    setIsLoading(false)
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsLoading(false)
  };

  const handleInputChange = async (e) => {
    const newSearchTerm = e.target.value;
    await setSearchTerm(newSearchTerm);
    await setSelectedSuggestion('');
    fetchSuggestions(newSearchTerm);
    setIsLoading(true)
  };

  const fetchSuggestions = async (query) => {
    // Use router object to access query parameters
    const queryParams = new URLSearchParams(router.query);
    try {
      const response = await fetch(`/api/search_result/?query=${query}&page=${queryParams.get('page') || 1}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'reload'
      });
      const data = await response.json();
      if (Array.isArray(data.result.data)) {
        const titles = data.result.data.map(item => item.title);
        setSuggestions(titles);
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const submit = (e) => {
    if (typeof searchTerm === 'string' && searchTerm.trim() !== '') {
      pushData();
    }
    if (e) {
      e.preventDefault();
      pushData();
    }
  };

  const pushData = async () => {
    const trimmedSearchTerm = searchTerm.trim();
    if (typeof trimmedSearchTerm === 'string' && trimmedSearchTerm !== '') {
      const queryString = `?query=${encodeURIComponent(trimmedSearchTerm)}`;
      await router.push(`/search_result${queryString}`);
      setSearchTerm('');
      closeModal();
      setProgress(30);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    await setSearchTerm(suggestion);
    await pushData();
  };

  useEffect(() => {
    if (suggestions.length > 0 && searchTerm.trim() !== "") {
      openModal();
    } else {
      closeModal();
    }
  }, [suggestions, searchTerm]);

  return (
    <>
      <form onSubmit={submit} className="ml-auto mb-2">
        <div className="relative max-w-md">
          <div className="bg-transparent absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-5.2-5.2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <input
            className="py-2 pl-10 pr-4 border border-gray-300 rounded-full w-full focus:ring focus:ring-blue-400 focus:border-blue-400"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='p-[3%]'>
          <h2 className="font-semibold mb-4">Suggestions</h2>
          <hr className='mb-3' />
          <ul>
            {suggestions && suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`cursor-pointer ${suggestion === selectedSuggestion ? 'text-blue-500' : 'text-gray-400'} hover:text-white`}
                onClick={async () => await handleSuggestionClick(suggestion)}
              >
                {suggestion}
                <hr className='m-[1%]' />
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
  )
}

export default Search;

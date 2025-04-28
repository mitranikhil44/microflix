"use client";

import React, { useEffect, useState } from 'react';

const AnimeDetail = ({ searchQuery = 'Naruto' }) => {
  const [animeData, setAnimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch(`/api/anime?query=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setAnimeData(data);
        } else {
          setError('Failed to fetch anime data');
        }
      } catch (err) {
        setError('Error fetching anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!animeData) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>{animeData.title}</h1>
      <img src={animeData.images.jpg.large_image_url} alt={animeData.title} />
      <p><strong>English Title:</strong> {animeData.title_english}</p>
      <p><strong>Japanese Title:</strong> {animeData.title_japanese}</p>
      <p><strong>Type:</strong> {animeData.type}</p>
      <p><strong>Status:</strong> {animeData.status}</p>
      <p><strong>Episodes:</strong> {animeData.episodes}</p>
      <p><strong>Score:</strong> {animeData.score}</p>
      <p><strong>Synopsis:</strong> {animeData.synopsis}</p>
      <a href={animeData.url} target="_blank" rel="noopener noreferrer">View on MyAnimeList</a>
    </div>
  );
};

export default AnimeDetail;
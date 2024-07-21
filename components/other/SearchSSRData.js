const SearchSSRData = async (queryString) => {
  try {
    const apiKey = process.env.API_KEY;
    const response = await fetch(
      `${apiKey}/api/search_result/?query=${queryString}&page=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const contents = await response.json();
    return contents;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default SearchSSRData;

const FetchSSRData = async (page, category) => {
  try {
    const response = await fetch(
      `${process.env.API_KEY}/api/blogs?category=${category}&page=${page}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store", // Ensures fresh data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const contents = await response.json();
    return { contents };
  } catch (error) {
    console.error("Fetch error:", error);
    return { contents: [] };
  }
};

export default FetchSSRData;

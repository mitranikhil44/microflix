const FetchSSRData = async (page, category) => {
  const apiKey = process.env.API_KEY;
  try {
    const response = await fetch(
      `${apiKey}api/blogs?category=${category}&page=${page}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 43200 },
      }
    );
    const contents = await response.json();

    return {
      contents,
      revalidate: 60
    };
  } catch (error) {
    return {
      contents: [],
    };
  }
};

export default FetchSSRData;
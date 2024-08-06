
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
        caches: "no-store"
      }
    );
    const contents = await response.json();

    return {
      contents,
    };
  } catch (error) {
    return {
      contents: [],
    };
  }
};

export default FetchSSRData;
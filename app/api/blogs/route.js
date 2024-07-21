import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import { Contents } from "@/models/scrapeSchema";
import { Anime_Contents } from "@/models/animeScrapeSchema";

export async function POST(req) {
  try {
    await connectToDatabase();
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("page_size")) || 12;
    const category = searchParams.get("category") || "contents";

    const validCategories = [
      "anime_contents",
      "anime_content_movies",
      "anime_content_seasons",
      "latest_anime_contents",
      "top_anime_contents",
      "top_anime_content_movies",
      "top_anime_content_seasons",
      "contents",
      "latest_contents",
      "content_movies",
      "content_seasons",
      "content_adult",
      "top_contents",
      "top_content_movies",
      "top_content_seasons",
      "top_content_adult",
    ];

    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category provided: ${category}`);
    }

    const response = await fetchContentData(category, page, pageSize);

    if (response.length > 0) {
      return Response.json(response, { status: 200 });
    } else {
      throw new Error("Invalid response");
    }
  } catch (error) {
    return Response.json(
      { error: error.message || "Error while fetching data" },
      { status: 500 }
    );
  } finally {
    mongoose.connection.close();
  }
}

async function fetchContentData(category, page, pageSize) {
  const response = [];

  try {
    if (category.startsWith("top_anime")) {
      const filterConditions = buildAnimeFilterConditions(category);
      const data = await Anime_Contents.aggregate(
        [
          { $match: filterConditions },
          { $sort: { "imdbDetails.imdbRating.rating": -1 } },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        {
          allowDiskUse: true,
        }
      ).exec();

      const totalCount = await Anime_Contents.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({ data, currentPage: page, pageSize, totalPages });
    } else if (category.startsWith("top_content")) {
      const filterConditions = buildFilterConditions(category);
      const data = await Contents.aggregate(
        [
          { $match: filterConditions },
          { $sort: { "imdbDetails.imdbRating.rating": -1 } },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        {
          allowDiskUse: true,
        }
      ).exec();

      const totalCount = await Contents.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({ data, currentPage: page, pageSize, totalPages });
    } else if (category.startsWith("anime")) {
      const filterConditions = buildAnimeFilterConditions(category);

      const data = await Anime_Contents.aggregate(
        [
          { $match: filterConditions },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        { allowDiskUse: true }
      ).exec();

      const totalCount = await Anime_Contents.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({ data, currentPage: page, pageSize, totalPages });
    } else if (category.startsWith("content")) {
      const filterConditions = buildFilterConditions(category);
      const data = await Contents.aggregate(
        [
          { $match: filterConditions },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        { allowDiskUse: true }
      ).exec();

      const totalCount = await Contents.countDocuments(filterConditions);
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({ data, currentPage: page, pageSize, totalPages });
    } else if (category === "latest_contents") {
      const currentDate = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
      const sortedData = await Contents.aggregate(
        [
          {
            $match: {
              releaseDate: {
                $lte: currentDate.toISOString().split("T")[0],
                $gte: twoMonthsAgo.toISOString().split("T")[0],
              },
            },
          },
          { $sort: { updatedAt: -1 } },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        { allowDiskUse: true }
      ).exec();

      const totalCount = await Contents.countDocuments({ releaseDate: {
        $lte: currentDate.toISOString().split("T")[0],
        $gte: twoMonthsAgo.toISOString().split("T")[0],
      }, });
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({
        data: sortedData,
        currentPage: page,
        pageSize,
        totalPages,
      });
    } else if (category === "latest_anime_contents") {
      const currentDate = new Date();
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
      const sortedData = await Anime_Contents.aggregate(
        [
          {
            $match: {
              releaseDate: {
                $lte: currentDate.toISOString().split("T")[0],
                $gte: twoMonthsAgo.toISOString().split("T")[0],
              },
            },
          },
          { $sort: { updatedAt: -1 } },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        { allowDiskUse: true }
      ).exec();

      const totalCount = await Anime_Contents.countDocuments({
        releaseDate: {
          $lte: currentDate.toISOString().split("T")[0],
          $gte: twoMonthsAgo.toISOString().split("T")[0],
        },
      });
      
      const totalPages = Math.ceil(totalCount / pageSize);
      response.push({
        data: sortedData,
        currentPage: page,
        pageSize,
        totalPages,
      });
    }
  } catch (error) {
    console.error("Error fetching data for category:", category);
    throw error; // Re-throw the error to be caught by the outer try-catch block
  }

  return response;
}

function buildAnimeFilterConditions(category) {
  switch (category) {
    case "anime_content_movies":
      return { $expr: { $lt: [{ $size: "$contentLinkData" }, 2] } };
    case "anime_content_seasons":
      return { $expr: { $gt: [{ $size: "$contentLinkData" }, 1] } };
    case "anime_contents":
      return {};
    case "top_anime_content_movies":
      return { $expr: { $lt: [{ $size: "$contentLinkData" }, 2] } };
    case "top_anime_content_seasons":
      return { $expr: { $gt: [{ $size: "$contentLinkData" }, 1] } };
    case "top_anime_contents":
      return {};
    default:
      throw new Error(`Invalid category provided: ${category}`);
  }
}

function buildFilterConditions(category) {  
  switch (category) {
    case "content_movies":
      return { title: { $not: { $regex: "season", $options: "i" } } };
    case "content_seasons":
      return { title: /season/i };
    case "content_adult":
      return { title: /18\+/i };
    case "contents":
      return {};
    case "top_content_movies":
      return { title: { $not: { $regex: "season", $options: "i" } } };
    case "top_content_seasons":
      return { title: /season/i };
    case "top_content_adult":
      return { title: /18\+/i };
    case "top_contents":
      return {};
    default:
      throw new Error(`Invalid category provided: ${category}`);
  }
}

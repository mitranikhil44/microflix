import connectToDatabase from "@/lib/mongodb";
import { Contents } from "@/models/scrapeSchema";
import { Anime_Contents } from "@/models/animeScrapeSchema";

export async function POST(req) {
  try {
    await connectToDatabase();

    const query = req.nextUrl.searchParams.get("query") || "";
    const pageNo = Math.max(1, parseInt(req.nextUrl.searchParams.get("page"), 10) || 1);
    const pageSize = Math.max(1, parseInt(req.nextUrl.searchParams.get("pageSize"), 10) || 12);

    const skip = (pageNo - 1) * pageSize;

    // Get total count of contents collection without applying skip and limit
    const contentTotalCount = await Contents.countDocuments({
      title: { $regex: new RegExp(query, "i") },
    });

    // Get total count of anime contents collection without applying skip and limit
    const animeContentsTotalCount = await Anime_Contents.countDocuments({
      title: { $regex: new RegExp(query, "i") },
    });

    const contentSuggestions = await Contents.find({
      title: { $regex: new RegExp(query, "i") },
    })
      .skip(skip)
      .limit(pageSize);

    const animeContentsSuggestions = await Anime_Contents.find({
      title: { $regex: new RegExp(query, "i") },
    })
      .skip(skip)
      .limit(pageSize);

    const interleavedSuggestions = await interleaveSuggestions(
      contentSuggestions,
      animeContentsSuggestions
    );

    // Sort interleaved suggestions by release year in descending order
    const sortedSuggestions = interleavedSuggestions.sort((a, b) => {
      const yearA = parseInt(a.releaseYear);
      const yearB = parseInt(b.releaseYear);
      return yearB - yearA;
    });

    return new Response(
      JSON.stringify({
        result: {
          totalData: contentTotalCount + animeContentsTotalCount,
          data: sortedSuggestions,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Error while fetching suggestions" }),
      { status: 500 }
    );
  }
}

// Function to interleave suggestions from two collections
async function interleaveSuggestions(contents, animeContents) {
  const interleavedSuggestions = [];
  const maxLength = Math.max(contents.length, animeContents.length);
  for (let i = 0; i < maxLength; i++) {
    if (contents[i]) interleavedSuggestions.push(contents[i]);
    if (animeContents[i]) interleavedSuggestions.push(animeContents[i]);
  }
  return interleavedSuggestions;
}

import connectToDatabase from "@/lib/mongodb";
import { Contents } from "@/models/scrapeSchema";
import { Anime_Contents } from "@/models/animeScrapeSchema";

export async function POST(req) {
  try {
    await connectToDatabase(); 

    const slug = req.nextUrl.searchParams.get("slug");
    const contents = await Contents.findOne({ slug });
    const animeContents = await Anime_Contents.findOne({ slug });

    if (contents || animeContents) {
      return Response.json({ content: contents || animeContents }, { status: 200 });
    } else {
      return Response.json({ error: "No Blogs Found" }, { status: 404 });
    }
  } catch (error) {
    return Response.json(
      { error: error.message || "Error while fetching data" },
      { status: 500 }
    );
  }
}

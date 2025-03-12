import fetch from "node-fetch";
import sharp from "sharp";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const width = searchParams.get("width"); 
  const height = searchParams.get("height"); 
  const format = searchParams.get("format"); 

  if (!url) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
    });
  }

  try {
    const response = await fetch(url); 
    if (!response.ok) throw new Error("Failed to fetch image");

    const imageBuffer = await response.arrayBuffer();
    const metadata = await sharp(Buffer.from(imageBuffer)).metadata();

    const finalFormat = format || metadata.format; // Keep original format unless specified
    const finalWidth = width ? parseInt(width) : metadata.width; // Keep original width
    const finalHeight = height ? parseInt(height) : metadata.height; // Keep original height

    const optimizedImage = await sharp(Buffer.from(imageBuffer))
      .resize(finalWidth, finalHeight) // Resize only if specified
      .toFormat(finalFormat, { quality: 80 }) // Convert format only if specified
      .toBuffer();

    return new Response(optimizedImage, {
      headers: {
        "Content-Type": `image/${finalFormat}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to process image" }), {
      status: 500,
    });
  }
}

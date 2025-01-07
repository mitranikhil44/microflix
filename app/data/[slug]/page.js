import Image from "next/image";
import ImdbDetails from "@/components/other/ImdbDetails";
import Contact from "@/components/other/ContactUs";

// Utility function to handle text trimming
const trimText = (text, length = 62) => (text || "").trimStart().slice(0, length) + "...";

export default async function Content_Post({ params }) {
  const { slug } = params;
  const response = await getContentData(slug);
  const content = response?.content || {};

  function createMarkup(content) {
    return { __html: content };
  }

  // Preprocessing content and extracting necessary parts
  const data = content.content?.toLowerCase() || "";
  const indexOfScreenshots = data.indexOf("screenshots");
  const indexOfStory = data.indexOf("synopsis");

  const contentScreens = content.contentSceens?.map((img, index) => `
    <div class="p-2 hover:scale-95 w-64" key="${index + 1}">
      <Image src="${img}" class="rounded-lg" height={100} width={100} />
    </div>
  `) || [];

  const screenshotsHTML = contentScreens.length > 0 ? `
    <div class="flex justify-center items-center flex-wrap">
      ${contentScreens.join("")}
    </div>
  ` : "";

  // const contentDownloadLinks = content.downloadableLinksHtml?.map(link => `${link} <hr>`) || [];


  let fullContentHTML = content.content?.slice(0, indexOfScreenshots + 55) 
  // + `
  //   <div class="text-center mt-8 space-y-4">${contentDownloadLinks.join("")}</div>
  // `
  + screenshotsHTML
   + content.content?.slice(indexOfScreenshots + 50) || "";

  // Clean up unwanted content
  fullContentHTML = fullContentHTML.replace(/VegaMovies\.To|VegaMovies|vegamovies/gi, "Microflix")
    // Remove <img> tags if the src doesn't start with 'https://'
    .replace(/<img[^>]*src="(?!https:\/\/)[^"]+"[^>]*>/g, "");

  // Extract meta description from the content
  let extractedText = "";
  if (indexOfStory !== -1 || indexOfScreenshots !== -1) {
    extractedText = data.slice(
      indexOfStory + `synopsis/plot:</span></h3><p>`.length - 2,
      indexOfScreenshots - `</p><h2 style="text-align: center;"><span style="color: #eef425;">`.length
    );
  } else {
    console.error("Keywords not found in the content");
  }

  // Generate final keywords from the content
  const listKeywordsTitle = content?.title?.split(" ") || [];
  const listImage = content?.image?.split("/") || [];
  const finalKeywords = [
    ...listKeywordsTitle, 
    content.title, 
    content.slug, 
    ...listImage
  ].join(", ");

  const contentTitle = content.title || "Content Title";

  return (
    <>
      <div>
        <title>{trimText(contentTitle)}</title>
        <meta property="og:title" content={trimText(contentTitle)} />
        <meta name="twitter:title" content={trimText(contentTitle)} />
        <meta name="description" content={extractedText.slice(0, 170)} />
        <meta name="keywords" content={finalKeywords} />
        <meta property="og:description" content={extractedText.slice(0, 170)} />
        <meta name="twitter:description" content={extractedText.slice(0, 170)} />
        <meta property="og:url" content={`https://microflix.vercel.app/data/${slug}`} />
        <link rel="canonical" href={`https://microflix.vercel.app/data/${slug}`} />
      </div>
      <div>
        <h1 className="text-center font-semibold xxl:text-4xl xl:text-3xl lg:text-2xl md:text-xl sm:text-lg text-base">
          {contentTitle}
        </h1>
        <ImdbDetails content={content} />
        <div
          className="flex flex-col text-justify justify-center gap-y-2 py-6 px-4 text-xs xs:text-sm md:text-base contentClass text-gray-700 contentCode"
          dangerouslySetInnerHTML={createMarkup(fullContentHTML)}
        ></div>
      </div>      
      <Contact/>
    </>
  );
}

export async function getContentData(slug) {
  const apiKey = process.env.API_KEY;
  try {
    const response = await fetch(`${apiKey}api/getblogs/?slug=${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching content data:", error);
    return { content: {} }; // Default to empty content if error occurs
  }
}

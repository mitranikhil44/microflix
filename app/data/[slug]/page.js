import Image from "next/image";
import ImdbDetails from "@/components/other/ImdbDetails";

export default async function Content_Post({ params }) {
  const { slug } = params;
  let response = await getContentData(slug);
  const content = response?.content || {};

  function createMarkup(content) {
    return { __html: content };
  }

  const data = content.content?.toLowerCase() || "";
  const indexOfScreenshots = data.indexOf("screenshots");
  const indexOfStory = data.indexOf("synopsis");

  const contentScreens =
    content.contentSceens?.map(
      (img, index) =>
        `<div class="p-2 hover:scale-95 w-64" key=${
          index + 1
        }><Image src=${img} class="rounded-lg" height={100} width={100} /></div>`
    ) || [];

  const screenshotsHTML = `
    <div class="flex justify-center items-center flex-wrap">
      ${contentScreens.join("")}
    </div>
  `;

  const contentDownloadLinks =
  content.downloadableLinksHtml?.map(
    (link) =>
      `${link} <hr>`
  ) || [];

let fullContentHTML =
  content.content?.slice(0, indexOfScreenshots + 55) +
    `<div class="text-center mt-8 space-y-4">${contentDownloadLinks.join("")}</div>` +
    content.content?.slice(indexOfScreenshots + 50) ||
  "";


  fullContentHTML = fullContentHTML
  // Remove the <img> element
  .replace(
    /<img[^>]*class="emoji"[^>]*src="https:\/\/s\.w\.org\/images\/core\/emoji\/11\/svg\/26a1\.svg"[^>]*>/g,
    ""
  )
  // Remove the first <div> element
  .replace(
    /<div class="divdr"[^>]*style="padding: 5px 120px 0 150px; background: #797d84; border-radius: 50%; margin-top: 30px;"[^>]*><\/div>/g,
    ""
  )
  // Remove the second <div> element
  .replace(
    /<div class="post-inner post-hover"[^>]*style="padding: 30px 90px 0 90px;"[^>]*><\/div>/g,
    ""
  )
   // Remove <p> tags that contain <img> tags
   .replace(
    /<p[^>]*>.*?<img[^>]*>.*?<\/p>/g,
    ""
  );


  
  // Replace "VegaMovies" and similar cases with "Microflix"
  const replaceRegex = /VegaMovies\.To|VegaMovies|vegamovies/gi;
  fullContentHTML = fullContentHTML.replace(replaceRegex, "Microflix");

  // Extract meta data description
  let extractedText = "";
  if (indexOfStory !== -1 && indexOfScreenshots !== -1) {
    extractedText += data.slice(
      indexOfStory + `synopsis/plot:</span></h3><p>`.length - 2,
      indexOfScreenshots -
        `</p><h2 style="text-align: center;"><span style="color: #eef425;">`
          .length
    );
  } else {
    console.error("Keywords not found in the content");
  }

  // Extract keywords
  const listKeywordsTitle = content?.title?.split(" ") || [];
  const listImage = content?.image?.split("/") || [];
  const finalKeywords =
    listKeywordsTitle.join(", ") +
    " " +
    content.title +
    content.slug +
    listImage.join(", ");

  return (
    <>
      <div>
        <title>{`${content.title?.trimStart().slice(0, 62)}...`}</title>
        <meta
          property="og:title"
          content={`${content.title?.trimStart().slice(0, 62)}...`}
        />
        <meta
          name="twitter:title"
          content={`${content.title?.trimStart().slice(0, 62)}...`}
        />
        <meta name="description" content={extractedText.slice(0, 170)} />
        <meta name="keywords" content={finalKeywords} />
        <meta property="og:description" content={extractedText.slice(0, 170)} />
        <meta
          name="twitter:description"
          content={extractedText.slice(0, 170)}
        />
        <meta
          property="og:url"
          content={`https://microflix.vercel.app/data/${slug}`}
        />
        <link
          rel="canonical"
          href={`https://microflix.vercel.app/data/${slug}`}
        />
      </div>
      <div>
        <h1 className="text-center font-semibold xxl:text-4xl xl:text-3xl lg:text-2xl md:text-xl sm:text-lg text-base">
          {content.title || "Content Title"}
        </h1>
        <ImdbDetails content={content} />
        <div
          className="flex flex-col text-justify justify-center gap-y-2 py-6 px-4 text-xs xs:text-sm md:text-base contentClass text-gray-700 contentCode"
          dangerouslySetInnerHTML={createMarkup(fullContentHTML)}
        ></div>
      </div>
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
    const myContent = await response.json();
    return myContent;
  } catch (error) {
    console.error("Error fetching content data:", error);
    return {
      content: {}, // Default to empty content if error occurs
    };
  }
}

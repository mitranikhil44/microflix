import Image from "next/image";
import ImdbDetails from "@/components/other/ImdbDetails";

export default async function Content_Post({ params }) {
  const { slug } = params;
  let response = await getContentData(slug);
  const content = response.content;

  function createMarkup(content) {
    return { __html: content };
  }

  const data = content.content.toLowerCase();
  const indexOfScreenshots = data.indexOf("screenshots");
  const indexOfStory = data.indexOf("synopsis");

  const contentScreens = content.contentSceens.map(
    (img, index) =>
      `<div class="p-2 hover:scale-95 w-64"><Image key=${
        index + 1
      } src=${img} class="rounded-lg" height={100} width={100} /></div>`
  );

  const screenshotsHTML = `
    <div class="flex justify-center items-center flex-wrap">
      ${contentScreens.join("")}
    </div>
  `;

  let fullContentHTML =
    content.content.slice(0, indexOfScreenshots + 55) +
    `<div class="your-custom-css-class">` +
    screenshotsHTML +
    `</div>` +
    content.content.slice(indexOfScreenshots + 50);

  // Remove specific HTML blocks using regex
  fullContentHTML = fullContentHTML.replace(
    /<p style="text-align: center;"><a href="[^"]+" target="_blank" rel="nofollow noopener noreferrer"><button class="dwd-button">Season 1<\/button><\/a> <a href="[^"]+" target="_blank" rel="nofollow noopener noreferrer"><button class="dwd-button">Season 2<\/button><\/a> <a href="[^"]+" target="_blank" rel="nofollow noopener noreferrer"><button class="dwd-button">Season 3<\/button><\/a><\/p>/g,
    ""
  );

  // Replace "VegaMovies" and similar cases with "Microflix"
  const replaceRegex = /VegaMovies\.To|VegaMovies|vegamovies/gi;
  fullContentHTML = fullContentHTML.replace(replaceRegex, "Microflix");

  // Extract meta data description
  let extractedText = "";
  if (indexOfStory !== -1 && indexOfScreenshots !== -1) {
    extractedText += data.slice(
      indexOfStory +
        `synopsis/plot:
          </span></h3>
            <p>`.length -
        2,
      indexOfScreenshots -
        `</p> 
            <h2 style="text-align: center;">
            <span style="color: #eef425;">`.length
    );
  } else {
    console.error("Keywords not found in the content");
  }

  // Extract keywords
  const listKeywordsTitle = content.title.split(" ");
  const listImage = content.image.split("/");
  const finalKeywords =
    listKeywordsTitle.join(", ") +
    " " +
    content.title +
    content.slug +
    listImage.join(", ");
  return (
    <>
      <div>
        <title>{`${content.title.trimStart().slice(0, 62)}...`}</title>
        <meta
          property="og:title"
          content={`${content.title.trimStart().slice(0, 62)}...`}
        />
        <meta
          name="twitter:title"
          content={`${content.title.trimStart().slice(0, 62)}...`}
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
          {content.title}
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
    const data = await fetch(`${apiKey}api/getblogs/?slug=${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const myContent = await data.json();
    return myContent;
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

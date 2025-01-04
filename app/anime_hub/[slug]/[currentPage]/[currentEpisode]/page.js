import Image from "next/image";
import StreamVideo from "@/components/StreamVideo";
import ImdbDetails from "@/components/other/ImdbDetails";
import Contact from "@/components/other/ContactUs";

export default async function Anime_Content_Post({ params }) {
  const { slug, currentEpisode, currentPage } = params;
  const parsedCurrentPage = parseInt(currentPage, 10);

  let response = await getContentData(slug);
  const content = response.content;

  function createMarkup(content) {
    return { __html: content };
  }

  const data = content.content.toLowerCase();

  const startTextIndex = data.indexOf(`class="description">`);
  const endTextIndex = data.indexOf("</div>", startTextIndex);

  // Extract meta data description
  let extractedText = "";
  if (startTextIndex !== -1 && endTextIndex !== -1) {
    extractedText = content.content.slice(
      startTextIndex + `class="description">`.length,
      endTextIndex
    );
  } else {
    console.error("Keywords not found in the content");
  }

  // Extract keywords
  const listKeywordsTitle = content.slug.split(" ");
  const listImage = content.image.split("/");
  const finalKeywords = listKeywordsTitle.join(", ") + " " + content.title + content.slug + listImage.join(", ");
  return (
    <>
      <div>
        <title>{`Download ${content.title.slice(0, 65)} Origin + Dubbed in 480p, 720p, 1080p, 2K and 4K`}</title>
        <meta property="og:title" content={`Download ${content.title.slice(0, 65)} Origin + Dubbed in 480p, 720p, 1080p, 2K and 4K`} />
        <meta name="twitter:title" content={`Download ${content.title.slice(0, 65)} in Origin+Dubbed in 480p, 720p, 1080p, 2K and 4K`} />
        <meta name="description" content={extractedText.slice(0, 170)} />
        <meta name="keywords" content={finalKeywords} />
        <meta property="og:description" content={extractedText.slice(0, 170)} />
        <meta
          name="twitter:description"
          content={extractedText.slice(0, 170)}
        />
        <meta
          property="og:url"
          content={`https://microflix.vercel.app/anime_hub/${slug}/${parsedCurrentPage}/${currentEpisode}`}
        />
        <link
          rel="canonical"
          href={`https://microflix.vercel.app/anime_hub/${slug}/${parsedCurrentPage}/${currentEpisode}`}
        />
      </div>
      <div>
        <h1 className="text-center font-semibold xxl:text-4xl xl:text-3xl lg:text-2xl md:text-xl sm:text-lg text-base">
          {content.title}
        </h1>
        <ImdbDetails content={content} />
        <div
          className="flex flex-col text-justify justify-center gap-y-2 py-6 px-4 text-xs xs:text-sm md:text-base contentClass text-gray-700 contentCode"
          dangerouslySetInnerHTML={createMarkup(
            content.content
              .replace(/h1/, /h2/)
              .replace(/<img[^>]*>/, "")
              .replace(/Click to manage book marks/gi, "")
          )}
        ></div>

        <div>
          <StreamVideo
            content={content}
            currentEpisodeNo={currentEpisode}
            slug={slug}
            currentPageNo={parsedCurrentPage}
          />
        </div>
      </div>
      <Contact/>
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

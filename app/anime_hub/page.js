import MoviesCollection from "@/components/Movie_Collection";
import LatestContents from "@/components/LatestContents";
import FetchSSRData from "@/components/other/FetchSSRData";

import Script from "next/script";

export default async function Home() {
  const latestData = await FetchSSRData(1, "latest_anime_contents");
  const contentData = await FetchSSRData(1, "anime_content_movies");
  const contentMoviesData = await FetchSSRData(1, "anime_contents");
  const contentSeriesData = await FetchSSRData(1, "anime_content_seasons");

  return (
    <>
    <div>
        <meta
          name="keywords"
          content="Microflix, microflix, movie download, free animes, Hollywood animes in Hindi, Bollywood animes, 2023 animes"
        />
        <title>
          Microflix - Watch and Download Animes in 480p, 720p & 1080p
        </title>
        <meta
          property="og:title"
          content="Microflix - Watch and Download Animes in 480p, 720p & 1080p"
        />
        <meta
          name="twitter:title"
          content="Microflix - Watch and Download Animes in 480p, 720p & 1080p"
        />
        <link rel="canonical" href="https://microflix.vercel.app/anime_hub" />
        <meta
          name="description"
          content="Microflix - Download in 480p, 720p, 1080p. Enjoy high-quality animes in Dubbed and original audio."
        />
        <meta
          property="og:description"
          content="Microflix - Download in 480p, 720p, 1080p. Enjoy high-quality animes in Dubbed and original audio."
        />
        <meta
          name="twitter:description"
          content="Microflix - Download in 480p, 720p, 1080p. Enjoy high-quality animes in Dubbed and original audio."
        />
        <meta property="og:url" content="https://microflix.vercel.app/anime_hub" />
      </div>
      {latestData.contents.length > 0 && (
        <LatestContents data={latestData?.contents[0]?.data} movieLink={"latest_anime_contents"} url={"anime_hub"} />
      )}
      {contentData.contents.length > 0 && (
        <MoviesCollection data={contentData?.contents[0]?.data} collectionName={"Anime Contents"} url={"anime_hub"} movieLink="anime_contents" />
      )}
      {contentMoviesData.contents.length > 0 && (
        <MoviesCollection data={contentMoviesData?.contents[0]?.data} collectionName={"Anime Movies"} url={"anime_hub"} movieLink="anime_movies" />
      )}
      {contentSeriesData.contents.length > 0 && (
        <MoviesCollection data={contentSeriesData?.contents[0]?.data} collectionName={"Anime Web Series"} url={"anime_hub"} movieLink="anime_web_series" />
      )}
      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-80H6K0RCMY"
        strategy="afterInteractive"
      />
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-80H6K0RCMY');
        `}
      </Script>
    </>
  );
}

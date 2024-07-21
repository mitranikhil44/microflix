import LatestContents from "@/components/LatestContents";
import MoviesCollection from "@/components/Movie_Collection";
import FetchSSRData from "@/components/other/FetchSSRData";

import Script from "next/script";

export default async function Home() {
  const latestData = await FetchSSRData(1, "latest_contents");
  const contentData = await FetchSSRData(1, "contents");
  const contentMoviesData = await FetchSSRData(1, "content_movies");
  const contentSeriesData = await FetchSSRData(1, "content_seasons");
  const contentAdultData = await FetchSSRData(1, "content_adult");

  return (
    <>
      <div>
        <meta
          name="keywords"
          content="Microflix, microflix, movie download, free movies, Hollywood movies in Hindi, Bollywood movies, 2023 movies"
        />
        <title>
          Microflix - Watch and Download Movies in 480p, 720p & 1080p
        </title>
        <meta
          property="og:title"
          content="Microflix - Watch and Download Movies in 480p, 720p & 1080p"
        />
        <meta
          name="twitter:title"
          content="Microflix - Watch and Download Movies in 480p, 720p & 1080p"
        />
        <link rel="canonical" href="https://www.microflix.in/" />
        <meta
          name="description"
          content="Microflix - Download in 480p, 720p, 1080p. Enjoy high-quality Movies and Seb Series in Dubbed Audio."
        />
        <meta
          property="og:description"
          content="Microflix -  Download in 480p, 720p, 1080p. Enjoy high-quality Movies and Seb Series in Dubbed Audio."
        />
        <meta
          name="twitter:description"
          content="Microflix - Download in 480p, 720p, 1080p. Enjoy high-quality Movies and Seb Series in Dubbed Audio."
        />
        <meta property="og:url" content="https://www.microflix.in/" />
      </div>
      {latestData.contents.length > 0 && (
        <LatestContents data={latestData?.contents[0]?.data} movieLink={"latest_contents"} url={"data"} />
      )}
      {contentData.contents.length > 0 && (
        <MoviesCollection data={contentData?.contents[0]?.data} collectionName={"Contents"} url={"data"} movieLink="contents" />
      )}
      {contentMoviesData.contents.length > 0 && (
        <MoviesCollection data={contentMoviesData?.contents[0]?.data} collectionName={"Movies"} url={"data"} movieLink="movies" />
      )}
      {contentSeriesData.contents.length > 0 && (
        <MoviesCollection data={contentSeriesData?.contents[0]?.data} collectionName={"Web Series"} url={"data"} movieLink="web_series" />
      )}
      {contentAdultData.contents.length > 0 && (
        <MoviesCollection data={contentAdultData?.contents[0]?.data} collectionName={"Adult Contents"} url={"data"} movieLink="adult_contents" />
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


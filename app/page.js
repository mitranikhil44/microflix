import ContentList from "@/components/ContentList";
import FetchSSRData from "@/components/other/FetchSSRData";
import PaginationButton from "@/components/other/PaginationButton";

import Script from "next/script";

export default async function Home() {
  const contentData = await FetchSSRData(1, "contents");
  
  const totalPages = contentData.contents[0]?.totalPages;
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
      {contentData.contents.length > 0 && (
        <ContentList contents={contentData.contents} />
      )}
      <PaginationButton
        totalPages={totalPages}
        page={1}
        cateogry={"contents"}
      />
      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-Q52T10QC04"
      />
      <Script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q52T10QC04');
        `}
      </Script>
    </>
  );
}

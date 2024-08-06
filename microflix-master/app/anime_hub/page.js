import FetchSSRData from "@/components/other/FetchSSRData";
import ContentList from "@/components/AnimeContentList";
import Script from "next/script";
import AnimePaginationButton from "@/components/other/AnimePaginationButton";

export default async function Home() {
  const contentData = await FetchSSRData(1, "anime_contents");
  const totalPages = contentData.contents[0]?.totalPages;

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
      <ContentList contents={contentData.contents}/>
      <AnimePaginationButton totalPages={totalPages} page={1} cateogry={"anime_contents"} />
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

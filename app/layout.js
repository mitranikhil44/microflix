import "./globals.css";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { WebStoreProvider } from "@/context";
import appleTouchIcon from "@/user_stuffs/fav_icons/apple-touch-icon.png";
import favicon32 from "@/user_stuffs/fav_icons/favicon-32x32.png";
import favicon16 from "@/user_stuffs/fav_icons/favicon-16x16.png";
import androidChrome192 from "@/user_stuffs/fav_icons/android-chrome-192x192.png";
import androidChrome512 from "@/user_stuffs/fav_icons/android-chrome-512x512.png";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="follow, index, imageindex" />
        <meta name="googlebot" content="index, follow, imageindex" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Cache-Control" content="no-store" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Social media tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Microflix" />
        <meta
          property="og:image"
          content="https://microflix.vercel.app/fav_icons/android-chrome-512x512.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="google-adsense-account" content="ca-pub-4724045884570258" />
        <meta
          name="google-site-verification"
          content="HzCShkhNsHqze7KztqMUe4veQUNUHyTrDV6_7_2iWwM"
        />
        <meta name="y_key" content="yahoo" />
        <meta name="yandex-verification" content="yandex" />

        {/* Favicon */}
        <link rel="icon" href="/fav_icons/favicon.ico" sizes="any" />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={appleTouchIcon.src}
        />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon32.src} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon16.src} />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={androidChrome192.src}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href={androidChrome512.src}
        />

        {/* Adsterra Ads Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Q52T10QC04"
        ></Script>

        {/* Monetag Ads Script */}
        {/* <meta name="monetag" content="a20e628094014ce867ca075c43b2bcaf" />
        <meta name="monetag" content="0a7a6c0e94fe9cfe5651563dbd68c5fc" /> */}

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PHQFK2KV');`}
        </Script>
      </head>
      <body
        className={`font-sans antialiased bg-gray-900 text-white ${inter.className}`}
      >
        <WebStoreProvider>
          <div>
            <Navbar />
            <div className="sm:gridClass mx-auto p-[3%] xl:w-[1560px] m-auto sm:w-[75%] w-full">
              {children}
              <Analytics />
              <SpeedInsights />
            </div>
          </div>
        </WebStoreProvider>

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PHQFK2KV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VFSRLKB31B"
        ></Script>
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VFSRLKB31B');
          `}
        </Script>
      </body>
    </html>
  );
}

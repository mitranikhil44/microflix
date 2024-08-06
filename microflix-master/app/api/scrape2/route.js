import axios from "axios";
import cheerio from "cheerio";
import connectToDatabase from "@/lib/mongodb";
import { Anime_Contents } from "@/models/animeScrapeSchema";

const BASE_URL_VERSION1 = "https://ww5.gogoanimes.fi/anime-list.html?page=";
const BASE_URL_VERSION2 = "https://ww5.gogoanimes.fi";

const scrapeCode = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error during scraping:", error.message, url);
  }
};

const scrapeImdbDetails = async (url, resultsText) => {
  try {
    const contentLink = `https://www.imdb.com${url}`;
    const linkData = await scrapeCode(contentLink);
    const $ = cheerio.load(linkData);

    const imdbDetails = {
      imdbName: resultsText || null,
      imdbPosterLink: null,
      imdbRating: { rawRating: null, rating: null, votes: null },
      imdbGenres: null,
      imdbMoreDetails: null,
    };

    const srcset = $("div.ipc-media--poster-27x40 img").first().attr("srcset");

    if (srcset) {
      const srcsetArray = srcset.split("w,").map((src) => {
        const [url, width] = src.trim().split(" ");
        return { url, width };
      });

      imdbDetails.imdbPosterLink = srcsetArray;
    } else {
      console.error("srcset attribute not found");
    }

    const imdbRatingText = $("div.eWQwwe div.dLwiNw").first().text();
    imdbDetails.imdbRating.rawRating = imdbRatingText;
    const regex = /(\d+(\.\d+)?\/10)([\d.,]+[KMB]?)$/;
    const match = imdbRatingText.match(regex);

    if (match) {
      imdbDetails.imdbRating.rating = match[1];
      imdbDetails.imdbRating.votes = match[3];
    } else {
      console.log("No IMDB rating data available", resultsText);
    }

    const collectGenres = $("div a.ipc-chip--on-baseAlt span")
      .map((_, el) => $(el).text().trim())
      .get();
    imdbDetails.imdbGenres = collectGenres.length
      ? collectGenres.join(", ")
      : null;

    const details = [];

    $("div[data-testid='title-details-section'] li[role='presentation']").each(
      function () {
        const detailKey = $(this)
          .find(
            "span.ipc-metadata-list-item__label, a.ipc-metadata-list-item__label"
          )
          .first()
          .text()
          .trim();
        let detailValues = [];

        if ($(this).find("ul.ipc-inline-list").length > 0) {
          $(this)
            .find("li[role='presentation']")
            .each(function () {
              const valueText = $(this)
                .find("a.ipc-metadata-list-item__list-content-item")
                .first()
                .text()
                .trim();
              if (valueText) detailValues.push(valueText);
            });
        } else {
          const singleValueText = $(this)
            .find(
              "a.ipc-metadata-list-item__list-content-item, span.ipc-metadata-list-item__list-content-item"
            )
            .first()
            .text()
            .trim();
          if (singleValueText) detailValues.push(singleValueText);
        }

        if (detailKey && detailValues.length > 0) {
          details.push({ detailKey, detailValue: detailValues.join(", ") });
        }
      }
    );

    imdbDetails.imdbMoreDetails = details;

    return imdbDetails;
  } catch (error) {
    console.error("Error during IMDB scraping:", error.message);
    throw error;
  }
};

const searchIMDb = async (query) => {
  try {
    const url = `https://www.imdb.com/find?q=${query}`;
    const scrapeData = await scrapeCode(url);
    const $ = cheerio.load(scrapeData);

    const resultsText = $(
      "li.find-result-item a.ipc-metadata-list-summary-item__t"
    )
      .first()
      .text();
    const resultsLinks = $(
      "li.find-result-item a.ipc-metadata-list-summary-item__t"
    ).attr("href");

    return { resultsText: resultsText, resultsLinks: resultsLinks };
  } catch (error) {
    console.error("Error during IMDb search:", error.message);
  }
};

function extractSearchableContent(title, contentText) {
  const findContent = {
    name: title.slice(0, 20),
    year: "",
  };

  const releaseYearMatch = contentText
    .toLowerCase()
    .match(/(?:released:|release:)\s*(\d{4})/i);

  if (releaseYearMatch) {
    findContent.year = releaseYearMatch[1].trim();
  } else {
    console.log("No match found for Released Year");
  }

  const searchableContent = `${findContent.name} ${findContent.year}`;
  return { search: searchableContent, releaseYear: findContent.year };
}

async function processArticle(article) {
  const { url, title } = article;
  try {
    const response = await axios.get(`${BASE_URL_VERSION2}${url}`);
    const $ = cheerio.load(response.data);

    const contentElement = $("div.main_body");
    if (!contentElement.length) {
      console.error("Content element not found for article:", title);
      return;
    }

    const slug =
      "download_" +
      title
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

    const mainContent = contentElement.find("div.anime_info_body_bg");

    const content = mainContent.html();

    const image = BASE_URL_VERSION2 + mainContent.find("img").attr("src");

    const searchableContent = extractSearchableContent(
      title.toLowerCase(),
      mainContent.text().trim()
    );

    const contentLinkData = await scrapeLinkData(`${BASE_URL_VERSION2}${url}`);

    const existingArticle = await Anime_Contents.findOne({ slug });
    let isUpdate = false;

    if (existingArticle) {
      if (existingArticle.contentLinkData.length === contentLinkData.length) {
        // No need to update
        console.log(`No new data for ${title}, skipping update.`);
      } else {
        // New content available, update existing entry
        const imdbData = await getIMDbDetails(
          searchableContent.search
            .replace(/[^\w\s]/g, "")
            .replace(/\s+/g, "_")
            .toLowerCase()
        );

        isUpdate = true;

        const releaseDate = await releasedDate(imdbData);

        await updateOrCreateDatabaseEntry({
          title,
          image,
          slug,
          content,
          contentLinkData,
          imdbData,
          releaseDate,
          updateData: isUpdate,
          releaseYear: searchableContent.releaseYear,
        });
      }
    } else {
      // New entry, create it
      const imdbData = await getIMDbDetails(
        searchableContent.search
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "_")
          .toLowerCase()
      );

      const releaseDate = await releasedDate(imdbData);

      await updateOrCreateDatabaseEntry({
        title,
        image,
        slug,
        content,
        contentLinkData,
        imdbData,
        releaseDate,
        updateData: isUpdate,
        releaseYear: searchableContent.releaseYear,
      });
    }
  } catch (error) {
    console.error("Error processing article:", error.message);
    throw error;
  }
}

async function releasedDate(imdbData) {
  let releaseDate = "";
  let releaseDetail = "";
  imdbData?.imdbMoreDetails?.map((detail) => {
    if (detail.detailKey === "Release date") {
      releaseDetail += detail.detailValue;
    }
  });
  if (releaseDetail) {
    releaseDate += new Date(releaseDetail).toISOString().split("T")[0];
  } else {
    console.warn("No release date found.");
  }
  return releaseDate;
}

async function getIMDbDetails(searchableContent) {
  try {
    const imdbLinks = await searchIMDb(searchableContent);
    return await scrapeImdbDetails(
      imdbLinks.resultsLinks,
      imdbLinks.resultsText
    );
  } catch (error) {
    console.error("Error fetching IMDB details:", error.message);
    return null;
  }
}

async function scrapeLinkData(url) {
  try {
    let nextEpisode = true;
    let episodeNo = 1;
    const linkDataList = [];

    while (nextEpisode) {
      const properUrl = url.replace("category/", "") + `-episode-${episodeNo}`;
      const response = await axios.get(properUrl);
      const $ = cheerio.load(response.data);
      const container = $("div.anime_video_body");
      const category = container
        .find("div.anime_video_body_cate a")
        .attr("title");
      const downloadLink = container.find("li.dowloads a").attr("href");
      const downloadableLinks = container
        .find("div.anime_muti_link a")
        .map((index, elem) => {
          return {
            name: $(elem)
              .text()
              .trim()
              .replace("Choose this server", "")
              .trim(),
            link: $(elem).attr("data-video"),
          };
        })
        .get();

      if (!downloadLink) {
        nextEpisode = false;
      } else {
        linkDataList.push({
          episodeNo,
          category,
          downloadLink,
          downloadableLinks,
        });
        episodeNo++;
      }
    }

    return linkDataList;
  } catch (error) {
    console.error("Error processing episode link data:", error.message);
    return [];
  }
}

async function updateOrCreateDatabaseEntry({
  title,
  image,
  slug,
  content,
  contentLinkData,
  imdbData,
  releaseDate,
  updateData,
  releaseYear,
}) {
  try {
    const existingArticle = await Anime_Contents.findOne({ slug });

    if (existingArticle) {
      await Anime_Contents.updateOne(
        { slug },
        {
          title,
          image,
          slug,
          content,
          contentLinkData,
          updateData,
          releaseDate,
          imdbDetails: imdbData || existingArticle.imdbDetails,
          releaseYear: releaseYear || existingArticle.releaseYear,
        }
      );
    } else {
      await Anime_Contents.create({
        title,
        image,
        slug,
        content,
        contentLinkData,
        updateData,
        releaseDate,
        imdbDetails: imdbData || null,
        releaseYear: releaseYear || null,
      });
    }
  } catch (error) {
    console.error("Error updating/creating database entry:", error.message);
  }
}

async function scrapePage(pageNumber) {
  const url = `${BASE_URL_VERSION1}${pageNumber}`;
  const setArticles = [];

  try {
    console.log(`Scraping page no. ${pageNumber}`);
    const response3 = await axios.get(url);
    const $ = cheerio.load(response3.data);

    $("div.anime_list_body li a").each((index, element) => {
      const title = $(element).text();
      const articleUrl = $(element).attr("href");
      setArticles.push({ title, url: articleUrl });
    });
    setArticles.reverse();
    for (const article of setArticles) {
      await processArticle(article);
    }
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error.message);
  }
}

async function processPages() {
  const site_1_starting_page = 83;
  const pageNumbers = Array.from(
    { length: site_1_starting_page },
    (_, i) => site_1_starting_page - i
  );

  for (const pageNumber of pageNumbers) {
    await scrapePage(pageNumber);
  }
}

async function main() {
  await connectToDatabase();

  try {
    await processPages();
    console.log("Scraping and processing completed.");
  } catch (error) {
    console.error("Error:", error.message);
    console.log("Error occurred during scraping.");
  }
}

main();

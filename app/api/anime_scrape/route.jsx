import axios from "axios";
import cheerio from "cheerio";
const isEqual = require("lodash.isequal");
import connectToDatabase from "@/lib/mongodb";
import { Anime_Contents } from "@/models/animeScrapeSchema";

const BASE_URL_VERSION1 = "https://www12.gogoanime.me/anime-list.html?page=";
const BASE_URL_VERSION2 = "https://www12.gogoanime.me";

const scrapeCode = async (url) => {
  try {
    const response = await fetchWithRetry(url, {
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
    try {
      if (srcset) {
        const srcsetArray = srcset.split("w,").map((src) => {
          const [url, width] = src.trim().split(" ");
          return { url, width };
        });
        imdbDetails.imdbPosterLink = srcsetArray;
      }
    } catch (e) {
      console.warn("Poster link extraction failed.");
    }

    const imdbRatingText = $("div.sc-d541859f-0");
    const rating1 = imdbRatingText.find("div.czkfBq").first().text();
    const rating2 = imdbRatingText.find("div.kxphVf").first().text();
    const rating3 = imdbRatingText.find("span.sc-d541859f-1").first().text();
    const votes1 = imdbRatingText.find("div.gUihYJ").first().text();
    const votes2 = imdbRatingText.find("div.dwhNqC").first().text();
    const votes3 = imdbRatingText.find("div.sc-d541859f-3").first().text();

    let rating = rating3?.trim() || rating2?.trim() || rating1?.trim() || "N/A";
    let votes = votes3?.trim() || votes2?.trim() || votes1?.trim() || "N/A";

    imdbDetails.imdbRating.rawRating = imdbRatingText.first().text();
    imdbDetails.imdbRating.rating = rating.replace("/10", "");
    imdbDetails.imdbRating.votes = votes;

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
    console.log(
      "Error during IMDb scraping:",
      error.message,
      "Data details = ",
      url,
      resultsText
    );
    throw error;
  }
};

const searchIMDb = async (query) => {
  let resultsLinks = "";
  let resultsText = "";
  try {
    const url = `https://www.imdb.com/find?q=${query}`;
    const scrapeData = await scrapeCode(url);
    const $ = cheerio.load(scrapeData);
    const title = $(
      "section.ipc-page-section ul li div.ipc-metadata-list-summary-item__c a"
    );
    resultsLinks += title.first().attr("href");
    resultsText += title.first().text();

    return { resultsText: resultsText, resultsLinks: resultsLinks };
  } catch (error) {
    console.log(
      "Error during IMDb search:",
      error.message,
      "Date details = ",
      resultsLinks,
      resultsText,
      query
    );
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
  const fullUrl = `${BASE_URL_VERSION2}${url}`;
  const slug = generateSlug(title);
  let isUpdate = false;

  try {
    // Fetch page content
    const response = await fetchWithRetry(fullUrl);
    const $ = cheerio.load(response.data);

    const contentElement = $("div.main_body");
    if (!contentElement.length) {
      console.error(`Main content not found for: ${title}`);
      return;
    }

    const mainContent = contentElement.find("div.anime_info_body_bg");
    const rawHtmlContent = mainContent.html() || "";

    const imageSrc = mainContent.find("img").attr("src") || "";
    const image = imageSrc.startsWith("http") ? imageSrc : BASE_URL_VERSION2 + imageSrc;

    const searchableContent = extractSearchableContent(
      title.toLowerCase(),
      mainContent.text().trim()
    );

    // Scrape episode/download data
    const contentLinkData = await scrapeLinkData(fullUrl);

    // Check for existing entry
    const existingEntry = await Anime_Contents.findOne({ slug });

    if (existingEntry) {
      if (isEqual(existingEntry.contentLinkData, contentLinkData)) {
        console.log(`No new episode data for "${title}", skipping update.`);
        return;
      }

      isUpdate = true;
    }

    // Get IMDb + release date regardless of new or update
    const imdbQuery = searchableContent.search
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const imdbData = await getIMDbDetails(imdbQuery);
    const releaseDate = await releasedDate(imdbData);

    // Create or update database
    await updateOrCreateDatabaseEntry({
      title,
      image,
      slug,
      content: rawHtmlContent,
      contentLinkData,
      imdbData,
      releaseDate,
      updateData: isUpdate,
      releaseYear: searchableContent.releaseYear,
    });

    console.log(`${isUpdate ? "Updated" : "Created"} entry for "${title}"`);

  } catch (error) {
    console.error(`Error processing article "${title}":`, error.message);
    throw error;
  }
}

// --- Helper: Slug Generator ---
function generateSlug(title) {
  return (
    "download_" +
    title
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase()
  );
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
    if (!imdbLinks?.resultsLinks) {
      console.warn(`IMDb search failed for: ${searchableContent}`);
      return getDefaultImdbData(searchableContent);
    }

    return await scrapeImdbDetails(imdbLinks.resultsLinks, imdbLinks.resultsText);
  } catch (error) {
    console.error("IMDb details fetch error:", error.message);
    return getDefaultImdbData(searchableContent);
  }
}

function getDefaultImdbData(title = "") {
  return {
    imdbName: title,
    imdbPosterLink: null,
    imdbRating: { rawRating: null, rating: "N/A", votes: "N/A" },
    imdbGenres: null,
    imdbMoreDetails: [],
  };
} 

async function scrapeLinkData(url) {
  const linkDataList = [];
  let episodeNo = 1;

  while (true) {
    const episodeUrl = url.replace("category/", "") + `-episode-${episodeNo}`;

    try {
      const response = await fetchWithRetry(episodeUrl);
      const $ = cheerio.load(response.data);
      const container = $("div.anime_video_body");

      if (!container.length) {
        break;
      }

      const category = container.find("div.anime_video_body_cate a").attr("title") || "";
      const downloadLink = container.find("li.dowloads a").attr("href") || "";

      const downloadableLinks = container
        .find("div.anime_muti_link li")
        .map((_, elem) => ({
          name: $(elem).text().trim().replace("Choose this server", "").trim(),
          link: $(elem).find("a").attr("data-video") || "",
        }))
        .get()
        .filter(item => item.link); // Remove invalid entries

      if (!downloadLink && downloadableLinks.length === 0) {
        break;
      }

      linkDataList.push({
        episodeNo,
        category,
        downloadLink,
        downloadableLinks,
      });

      episodeNo++;

    } catch (error) {
      if (error.response && error.response.status === 404) {
        break;
      } else {
        console.log(`Unexpected error at episode ${episodeNo}:`, error.message);
        break; // Optional: continue to next episode if you prefer
      }
    }
  }
  return linkDataList;
}

let insertedPagesCount = 0; // Counter for tracking inserted pages
let articlesToInsert = []; // Array to collect articles for batch insert

// Function to update or create database entry with batch processing
async function updateOrCreateDatabaseEntry({
  title,
  url,
  image,
  contentLinkData,
  slug,
  content,
  releaseYear,
  releaseDate,
  imdbData,
}) {
  if (!title || !slug || !image || !content) {
    console.warn(`Essential data missing, skipping: ${title}`);
    return;
  } 
  try {
    const updateData = {
      title,
      url: url || "",
      image,
      contentLinkData: contentLinkData || [],
      slug,
      content,
      releaseYear: releaseYear || null,
      releaseDate: releaseDate || null,
      imdbDetails: imdbData || getDefaultImdbData(title),
    };
    
    // Check if the article already exists
    const existingArticle = await Anime_Contents.findOne({ slug });

    if (existingArticle) {
      // If exists, update the entry
      await Anime_Contents.updateOne({ slug }, updateData);
      console.log(`Article with slug ${slug} updated`);
    } else {
      // Collect new articles for batch insertion
      articlesToInsert.push(updateData);
    }

    // Perform batch insert when the threshold is met
    if (articlesToInsert.length >= 50) {
      await Anime_Contents.insertMany(articlesToInsert); // Bulk insert
      console.log(`Inserted batch of new articles`);
      articlesToInsert = []; // Clear the array after batch insert
    }
  } catch (error) {
    console.error("Error updating/creating database entry:", error.message);
  }
}

// Finalize batch insert after all pages are processed
async function finalizeBatchInsert() {
  try {
    if (articlesToInsert.length > 0) {
      await Anime_Contents.insertMany(articlesToInsert);
      console.log(`Final batch inserted with ${articlesToInsert.length} articles`);
      articlesToInsert = []; 
    }
  } catch (error) {
    console.error("Error during batch insertion:", error.message);
  }
}

async function scrapePage(pageNumber) {
  const url = `${BASE_URL_VERSION1}${pageNumber}`;
  const setArticles = [];

  try {
    console.log(`Scraping page no. ${pageNumber}`);
    const response = await fetchWithRetry(url);
    const $ = cheerio.load(response.data);

    $("div.anime_list_body li a").each((_, element) => {
      const title = $(element).text();
      const url = $(element).attr("href");
      setArticles.push({ title, url });
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
  const site_1_starting_page = 142;
  const pageNumbers = Array.from({ length: 143 }, (_, i) => site_1_starting_page - i);

  const batchSize = 1; // Number of pages to scrape in a batch
  for (let i = 0; i < pageNumbers.length; i += batchSize) {
    const batch = pageNumbers.slice(i, i + batchSize);

    // Scrape the batch concurrently
    await Promise.all(
      batch.map(async (pageNumber) => {
        await scrapePage(pageNumber);
      })
    );

    // Finalize batch insert for this set of scraped data
    const insertedCount = articlesToInsert.length;
    if (insertedCount > 0) {
      await finalizeBatchInsert();
      insertedPagesCount += insertedCount;
      console.log(`Inserted pages so far: ${insertedPagesCount}`);
    }
  }
}

// Start the scraping process
async function main() {
  await connectToDatabase();

  try {
    await processPages();
    console.log(`Scraping and processing completed. Total pages inserted: ${insertedPagesCount}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function fetchWithRetry(url, retries = 3, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (err) {
      if (err.code === 'ECONNRESET' && i < retries - 1) {
        console.warn(`Retrying ${url} (attempt ${i + 1})...`);
        await delay(delayMs);
      } else {
        throw err;
      }
    }
  }
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
main();
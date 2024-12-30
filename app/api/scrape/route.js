import axios from "axios";
import cheerio from "cheerio";
const puppeteer = require("puppeteer");
import connectToDatabase from "@/lib/mongodb";
import { Contents } from "@/models/scrapeSchema";

const BASE_URL = "https://vegamovies.st/page/";
const BASE_URL2 = "https://rogmovies.com/page/";

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
    console.log("Error during scraping:", error.message);
    throw new Error("Failed to fetch data from the provided URL");
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
    }

    const imdbRatingText = $("div.eWQwwe div.kFvAju");
    const rating = imdbRatingText.find("div.czkfBq").first().text();
    const votes = imdbRatingText.find("div.gUihYJ").first().text();
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

function extractSearchableContent(contentTextArray) {
  const findContent = {
    name: "",
    year: "",
  };

  contentTextArray.forEach((e) => {
    const movieNameMatch = e.match(
      /(?:movie|show|series|full)\s*name:\s*(.*)/i
    );
    const releaseYearMatch = e.match(/(?:released|release)\s*year:\s*(\d{4})/i);

    if (movieNameMatch) {
      findContent.name = movieNameMatch[1].trim();
    }

    if (releaseYearMatch) {
      findContent.year = releaseYearMatch[1].trim();
    }
  });

  if (!findContent.name && !findContent.year) {
    console.log("No match found for Movie Name and Released Year");
  }

  const searchableContent = findContent.name + " " + findContent.year;
  return { search: searchableContent, releaseYear: findContent.year };
}

async function downloadLinkPage(linkUrl) {
  try {
    const response = await axios.get(linkUrl);

    // Load HTML into Cheerio
    const $ = cheerio.load(response.data);

    // Extract content from possible containers
    const entryContent = $("div.entry-content").html();
    const entryInner = $("div.entry-inner").html();

    // Determine which content to use
    const content = entryContent || entryInner;

    if (!content) {
      console.log(`No relevant content found for URL: ${linkUrl}`);
      return null;
    }

    return content;
  } catch (error) {
    console.error(`Error fetching page content for URL: ${linkUrl}`, error.message);
    return null;
  }
}

async function scrapeDynamicImageUrls(url) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const imageUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("div.entry-content img"))
        .map((img) => {
          const imgSrc = img.getAttribute("src");
          const imgDataSrc = img.getAttribute("data-src");
          return imgDataSrc || imgSrc;
        })
        .filter(Boolean);
    });

    return imageUrls;
  } catch (error) {
    console.error(`Error scraping dynamic image URLs for ${url}, error.message`);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

async function processArticle(article) {
  const { url, title, image } = article;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const contentElement = $("div.entry-content");
    if (!contentElement.length) {
      console.log(`Content element not found for article: ${title}`);
      return;
    }

    const slug = title
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "_")
      .toLowerCase();

    const imgUrls = await scrapeDynamicImageUrls(url);

    const contentTextArray = contentElement
      .find("p")
      .map((_, e) => $(e).text().toLowerCase())
      .get();

    const content = contentElement
      .html()
      ?.replace(/Vegamovies/g, (match, offset, input) => {
        const srcIndex = input.lastIndexOf('src="', offset);

        if (srcIndex === -1 || input.indexOf('"', srcIndex + 5) < offset) {
          return "Microflix";
        } else {
          return match;
        }
      }) || "";

    const searchableContent = extractSearchableContent(contentTextArray);
    const imdbData = await getIMDbDetails(
      searchableContent.search
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase()
    );

    const downloadLinkPromises = contentElement
      .find("p")
      .map(async function () {
        try {
          const paragraphText = $(this).text().trim().toLowerCase();

          if (/download( now)?|episode( wise)?|batch\/?zip|batch|zip/i.test(paragraphText)) {
            const downloadLink = $(this).find("a").attr("href");

            if (/^https?:\/\//i.test(downloadLink)) {
              const processedLink = await downloadLinkPage(downloadLink);
              return processedLink;
            }
          }
          return null;
        } catch (error) {
          console.error("Error processing a download link:", error.message);
          return null;
        }
      })
      .get();

    const downloadableLinksHtml = (
      await Promise.all(downloadLinkPromises)
    ).filter(Boolean);

    const releaseDate = await releasedDate(imdbData);

    await updateOrCreateDatabaseEntry({
      title: title || null,
      url: url || null,
      image: image || null,
      downloadableLinksHtml: downloadableLinksHtml || null,
      slug: slug || null,
      content: content || null,
      imgUrls: imgUrls || null,
      imdbData: imdbData || null,
      releaseDate: releaseDate || null,
      releaseYear: searchableContent.releaseYear || null,
    });
  } catch (error) {
    console.error(`Error processing article for URL: ${url}`, error.message);
  }
}

async function releasedDate(imdbData) {
  let releaseDate = null;
  let releaseDetail = "";
  imdbData?.imdbMoreDetails?.forEach((detail) => {
    if (detail.detailKey === "Release date") {
      releaseDetail += detail.detailValue;
    }
  });
  if (releaseDetail) {
    releaseDate = new Date(releaseDetail).toISOString().split("T")[0];
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
    console.log("Error fetching IMDB details:", error.message);
    return null;
  }
}

let insertedPagesCount = 0; // Counter for tracking inserted pages

let articlesToInsert = []; // Array to collect articles for batch insert

// Function to update or create database entry with batch processing and check for existing entries
async function updateOrCreateDatabaseEntry({
  url,
  title,
  image,
  downloadableLinksHtml,
  slug,
  content,
  releaseYear,
  releaseDate,
  imgUrls,
  imdbData,
}) {
  try {
    const updateData = {
      title,
      url,
      image,
      downloadableLinksHtml,
      slug,
      content,
      releaseYear: releaseYear || null,
      releaseDate: releaseDate || null,
      contentSceens: imgUrls,
      imdbDetails: imdbData || null,
    };

    // Check if the article already exists based on the slug
    const existingArticle = await Contents.findOne({ slug });

    if (existingArticle) {
      // If the article already exists, update it
      await Contents.updateOne({ slug }, updateData);
      console.log(`Article with slug ${slug} updated`);
    } else {
      // If the article does not exist, add it to the collection for batch insertion
      articlesToInsert.push(updateData);
    }

    // Perform batch insert when threshold is met (e.g., 50 articles)
    if (articlesToInsert.length >= 50) {
      await Contents.insertMany(articlesToInsert); // Bulk insert all collected data
      console.log('Inserted batch of new articles');
      articlesToInsert = []; // Clear the array after the batch insert
    }

  } catch (error) {
    console.log("Error updating/creating database entry:", error.message);
  }
}

// Inside finalizeBatchInsert, return the number of inserted pages
async function finalizeBatchInsert() {
  try {
    // Example: Let's assume articlesToInsert is your array of articles to insert
    const insertedCount = articlesToInsert.length;
    if (insertedCount > 0) {
      // Insert articles into the database (use your existing insertion logic)
      await Contents.insertMany(articlesToInsert);
      articlesToInsert.length = 0; // Clear the array after inserting

      return insertedCount; // Return the number of inserted pages
    } else {
      return 0; // No articles to insert
    }
  } catch (error) {
    console.log("Error during batch insertion:", error.message);
    return 0;
  }
}


async function scrapePage(pageNumber, site) {
  const url = `${site}${pageNumber}/`;
  const url2 = `${BASE_URL2}${pageNumber}/`;
  const site1Articles = [];
  const site2Articles = [];

  try {
    console.log(`Scraping page no. ${pageNumber}`);

    const response1 = await axios.get(url);
    const $1 = cheerio.load(response1.data);

    $1("article.post-item").each((index, element) => {
      const title = $1(element).find("div.listing-content a").text();
      const articleUrl = $1(element).find("a").attr("href");
      const imageDataSrc = $1(element)
        .find("div.blog-pic img")
        .attr("data-src");
      const imageSrc = $1(element).find("div.blog-pic img").attr("src");
      const image = imageDataSrc !== undefined ? imageDataSrc : imageSrc;
      console.log(image);
      site1Articles.push({ title, url: articleUrl, image });
    });
    site1Articles.reverse();

    if (pageNumber <= 310) {
      const response2 = await axios.get(url2);
      const $2 = cheerio.load(response2.data);

      $2("article.post-item").each((index, element) => {
        const title = $2(element).find("div.listing-content a").text();
        const articleUrl = $2(element).find("a").attr("href");
        const imageDataSrc = $1(element)
          .find("div.blog-pic img")
          .attr("data-src");
        const imageSrc = $1(element).find("div.blog-pic img").attr("src");
        const image = imageDataSrc !== undefined ? imageDataSrc : imageSrc;
        console.log(image);
        site2Articles.push({ title, url: articleUrl, image });
      });

      site2Articles.reverse();
      const maxArticles = Math.max(site1Articles.length, site2Articles.length);
      for (let i = 0; i < maxArticles; i++) {
        if (i < site1Articles.length) {
          await processArticle(site1Articles[i]);
        }
        if (i < site2Articles.length) {
          await processArticle(site2Articles[i]);
        }
      }
    } else {
      for (const article of site1Articles) {
        await processArticle(article);
      }
    }
  } catch (error) {
    console.log(`Error scraping page ${pageNumber}:`, error.message);
  }
}

async function processPages() {
  const site_1_starting_page = 563;
  const pageNumbers = Array.from(
    { length: 563 },
    (_, i) => site_1_starting_page - i
  );

  const batchSize = 10; // Number of pages to scrape concurrently
  for (let i = 0; i < pageNumbers.length; i += batchSize) {
    const batch = pageNumbers.slice(i, i + batchSize);
    
    // Scrape the batch concurrently and wait for them to complete
    await Promise.all(
      batch.map(async (pageNumber) => {
        await scrapePage(pageNumber, BASE_URL);
      })
    );
    
    // After each batch, call finalizeBatchInsert to insert the data
    const insertedCount = await finalizeBatchInsert(); // Insert any remaining articles

    // Log the number of pages inserted
    insertedPagesCount += insertedCount;
    console.log(`Inserted pages so far: ${insertedPagesCount}`);
  }
}


async function main() {
  try {
    await connectToDatabase();

    console.log("Starting scraping process...");
    await processPages();

    console.log("Scraping and processing completed.");
  } catch (error) {
    console.error("Error during scraping process:", error.message);
  }
}

main();


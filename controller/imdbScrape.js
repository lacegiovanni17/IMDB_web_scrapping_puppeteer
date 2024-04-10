const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { scrollPage, delay } = require("../helper/scrolling");

async function getImdbScrape(req, res) {
  try {
    console.log("crawling imdb");

    // Define the URL to scrape
    const url = `https://www.imdb.com/chart/top/?ref_=nv_mv_250`;

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
    });

    // Create a new page
    const page = await browser.newPage();

    // Set additional HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Delay for 1 second
    await delay(1000);

    // Scroll the page to load all content
    await scrollPage(page);

    // Get the page content
    const data = await page.content();

    // Close the browser
    await browser.close();

    // Load the page content into Cheerio for parsing
    const $ = cheerio.load(data);

    // Select the list items containing the movie data
    const listItems = $("ul.ipc-metadata-list li");

    // Create an array to store the scraped items
    const items = [];

    console.log(listItems.length);

    // Iterate over each list item
    listItems.each((idx, el) => {
      let productData = $(el);
      const item = {};

      // Extract the image URL
      item.image = productData
        .children("div.cli-poster-container")
        .children("div.ipc-poster")
        .children("div.ipc-media")
        .children("img")
        .attr("src");

      // Extract the link URL
      item.link = productData
        .children("div.cli-poster-container")
        .children("div.ipc-poster")
        .children("a")
        .attr("href");

      // Prepending the base URL if the link doesn't start with 'https://www.imdb.com/'
      if (item.link && !item.link.startsWith('https://www.imdb.com/')) {
        item.link = 'https://www.imdb.com' + item.link;
      }

      // Extract the movie name
      item.name = productData
        .children("div.ipc-metadata-list-summary-item__c")
        .children("div.ipc-metadata-list-summary-item__tc")
        .children("div.sc-b189961a-0")
        .children("div.ipc-title")
        .children("a")
        .children("h3")
        .text()
        .split(". ")[1]
        .trim();

      // Extract the release date (only the first 4 digits)
      item.release_date = productData
        .children("div.ipc-metadata-list-summary-item__c")
        .children("div.ipc-metadata-list-summary-item__tc")
        .children("div.sc-b189961a-0")
        .children("div.sc-b189961a-7")
        .children("span.sc-b189961a-8")
        .text()
        .split(" ")[0]
        .trim()
        .substring(0, 4);

      // Extract the rating
      item.rating = productData
        .children("div.ipc-metadata-list-summary-item__c")
        .children("div.ipc-metadata-list-summary-item__tc")
        .children("div.sc-b189961a-0")
        .children("span.sc-b189961a-1")
        .children("div.sc-e2dbc1a3-0")
        .children("span.ipc-rating-star")
        .text()
        .split("(")[0]
        .trim();

      // Add the item to the array
      items.push(item);
    });

    // Create the result object
    const result = {
      items: items,
      response: {
        method: req.method,
        status: "Successful",
        message: "Data scraped successfully",
      }
    };

    console.log("imdb done, items =", items.length);

    // Return the result as a JSON response
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    // Return an error response if an error occurs
    return res.status(500).json({
      method: req.method,
      status: "Error",
      message: "An error occurred while scraping data",
    });
  }
}

module.exports = {
  getImdbScrape
};

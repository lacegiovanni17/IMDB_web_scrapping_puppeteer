const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { scrollPage, delay } = require("./helper/scrolling");



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get("/", async (req, res) => {
  try {
    console.log("crawling imdb");
    const url = `https://www.imdb.com/chart/top/?ref_=nv_mv_250`;
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await delay(1000);
    await scrollPage(page)

    const data = await page.content();
    // console.log(data);
    await browser.close();
    const $ = cheerio.load(data);
    const listItems = $("ul.ipc-metadata-list li");
    const items = [];
    console.log(listItems.length);
    listItems.each((idx, el) => {
      let productData = $(el)
      const item = {};
      item.image = productData
        .children("div.cli-poster-container")
        .children("div.ipc-poster")
        .children("div.ipc-media")
        .children("img")
        .attr("src");
      item.link = productData
        .children("div.cli-poster-container")
        .children("div.ipc-poster")
        .children("a")
        .attr("href");
      // Prepending the base URL if the link doesn't start with https://www.imdb.com/'
      if (item.link && !item.link.startsWith('https://www.imdb.com/')) {
        // Prepend the base URL
        item.link = 'https://www.imdb.com' + item.link;
      }
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
      items.push(item);
    });

      const result = {
        items: items,
        response: {
          method: req.method,
          status: "Successful",
          message: "Data scraped successfully",
        }
      };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      method: req.method,
      status: "Error",
      message: "An error occurred while scraping data",
    });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

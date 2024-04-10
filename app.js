const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const axios = require("axios").default;
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require("cheerio");
const { scrollPage } = require("../helper/scrolling");
const { delay } = require("../helper/helper");
require("dotenv").config();
puppeteer.use(StealthPlugin());



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
      headless: "new",
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.solveRecaptchas(); // Use the plugin to solve reCAPTCHA
    await delay(1000);
    await scrollPage(page)

    const data = await page.content();
    // console.log(data);
    await browser.close();
    const $ = cheerio.load(data);
    const listItems = $("div.ProductListWithLoadMore0__listingGrid div.ProductList0__productItemContainer");
    const items = [];
    console.log(listItems.length);
    listItems.each((idx, el) => {
      let productData = $(el)
      const item = {};
      item.image = productData
        .children("a")
        .children("div.ProductItem25")
        .children("div.ProductItem25__p")
        .children("div.ProductItem25__imageContainer")
        .children("div")
        .children("div.DoubleImage18")
        .children("div.DoubleImage18")
        .children("div.AspectRatio18")
        .children("div.AspectRatio18__content")
        .children("div.Image18__imageContainer")
        .children("picture")
        .children("img")
        .attr("src");
      if (!item.image) {
        // Run the second case to get a value for item.image
        item.image = productData
          .children("a")
          .children("div.ProductItem25")
          .children("div.ProductItem25__p")
          .children("div.ProductItem25__imageContainer")
          .children("div")
          .children("div.ViewportObserver1")
          .children("div.DoubleImage18")
          .children("div.DoubleImage18")
          .children("div.AspectRatio18")
          .children("div.AspectRatio18__content")
          .children("div.Image18__imageContainer")
          .children("picture")
          .children("img")
          .attr("src");
      }
      //  Prepending the base image URL if the link doesn't start with 'https:'
      if (item.image && !item.image.startsWith('https:')) {
        // Prepend the base URL
        item.image = 'https:' + item.image;
      }
      item.link = productData
        .children("a")
        .attr("href");
      // Prepending the base URL if the link doesn't start with https://www.theoutnet.com/'
      if (item.link && !item.link.startsWith('https://www.theoutnet.com/')) {
        // Prepend the base URL
        item.link = 'https://www.theoutnet.com' + item.link;
      }
      item.name = productData
        .children("a")
        .children("div.ProductItem25")
        .children("div.ProductItem25__p")
        .children("div.ProductItem25__skeletonContainer")
        .children("div.ProductItem25__content")
        .children("span.ProductItem25__details")
        .children("span.ProductItem25__name")
        .text()
        .trim();

      item.price = productData
        .children("a")
        .children("div.ProductItem25")
        .children("div.ProductItem25__p")
        .children("div.ProductItem25__skeletonContainer")
        .children("div.ProductItem25__content")
        .children("div.PriceWithSchema10")
        .children("div.PriceWithSchema10__value")
        .text();

      item.old_price = productData
        .children("a")
        .children("div.ProductItem25")
        .children("div.ProductItem25__p")
        .children("div.ProductItem25__skeletonContainer")
        .children("div.ProductItem25__content")
        .children("div.PriceWithSchema10")
        .children("div.PriceWithSchema10__discountContainer")
        .children("s.PriceWithSchema10__wasPriceListingPage")
        .text()
        .trim();
      
      items.push(item);
    });
    return items;
    return res.status(200).json({
      method: req.method,
      status: "Sucessful",
      message: "data scraped succesfully",
      movieArray,
    });
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

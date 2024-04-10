const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get("/", async (req, res) => {
  try {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(req.body.url);

    // Wait and click on first result

    await page.waitForSelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > h1"
    );

    let title = await page.$(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > h1"
    );
    let titleInfo = await page.evaluate((el) => el.textContent, title);
    console.log(titleInfo);

    await page.waitForSelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > ul > li:nth-child(1)"
    );

    let releaseDate = await page.$(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > ul > li:nth-child(1)"
    );
    let releaseInfo = await page.evaluate((el) => el.textContent, releaseDate);
    console.log(releaseInfo);

    await page.waitForSelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-3a4309f8-0.fjtZsE.sc-dffc6c81-1.fJrHDo > div > div:nth-child(1) > a > span > div > div.sc-bde20123-0.gtEgaf > div.sc-bde20123-2.gYgHoj > span.sc-bde20123-1.iZlgcd"
    );

    let rating = await page.$(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-3a4309f8-0.fjtZsE.sc-dffc6c81-1.fJrHDo > div > div:nth-child(1) > a > span > div > div.sc-bde20123-0.gtEgaf > div.sc-bde20123-2.gYgHoj > span.sc-bde20123-1.iZlgcd"
    );
    let ratingInfo = await page.evaluate((el) => el.textContent, rating);
    console.log(ratingInfo);

    await page.waitForSelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > ul > li:nth-child(3)"
    );

    let movieTime = await page.$(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > section > div:nth-child(4) > section > section > div.sc-e226b0e3-3.jJsEuz > div.sc-dffc6c81-0.iwmAVw > ul > li:nth-child(3)"
    );
    let timeInfo = await page.evaluate((el) => el.textContent, movieTime);
    console.log(timeInfo);

    await page.waitForSelector(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > div > section > div > div.sc-9178d6fe-1.kFxVZc.ipc-page-grid__item.ipc-page-grid__item--span-2 > section.ipc-page-section.ipc-page-section--base.sc-bfec09a1-0.gmonkL.title-cast.title-cast--movie.celwidget > ul > li:nth-child(1) > div > ul > li > a"
    );

    let movieDirector = await page.$(
      "#__next > main > div > section.ipc-page-background.ipc-page-background--base.sc-304f99f6-0.eaRXHu > div > section > div > div.sc-9178d6fe-1.kFxVZc.ipc-page-grid__item.ipc-page-grid__item--span-2 > section.ipc-page-section.ipc-page-section--base.sc-bfec09a1-0.gmonkL.title-cast.title-cast--movie.celwidget > ul > li:nth-child(1) > div > ul > li > a"
    );
    let directorInfo = await page.evaluate(
      (el) => el.textContent,
      movieDirector
    );
    console.log(directorInfo);

    // await page.waitForSelector(
    //   "#__next > main > div.ipc-page-content-container.ipc-page-content-container--center.sc-383f2ac5-0.bfcGjo > div.ipc-page-grid.ipc-page-grid--bias-left > div.celwidget > div > div:nth-child(3) > div.sc-8dcff363-12.GYSnw > div.sc-8dcff363-13.jWSVUL"
    // );

    // let movieSummary = await page.$(
    //   "#__next > main > div.ipc-page-content-container.ipc-page-content-container--center.sc-383f2ac5-0.bfcGjo > div.ipc-page-grid.ipc-page-grid--bias-left > div.celwidget > div > div:nth-child(3) > div.sc-8dcff363-12.GYSnw > div.sc-8dcff363-13.jWSVUL"
    // );
    // let summaryInfo = await page.evaluate((el) => el.textContent, movieSummary);
    // console.log(summaryInfo);

    await browser.close();
    const movies = {
      title: titleInfo,
      year: releaseInfo,
      time: timeInfo,
      rating: ratingInfo,
      director: directorInfo,
      // summary: summaryInfo,
    };
    // Create an empty array to hold movie data
    let movieArray = [];
    // Push each movie's data into the array as an object
    movieArray.push({
      title: titleInfo,
      year: releaseInfo,
      time: timeInfo,
      rating: ratingInfo,
      director: directorInfo,
      // summary: summaryInfo,
    });

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


async function scrollPage(page) {

    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const scrollStep = 100;
    const scrollDelay = 100;
    let scrollTop = 0;
    while (scrollTop < scrollHeight) {
      await page.evaluate((top) => {
        window.scrollTo(0, top);
      }, scrollTop);
      scrollTop += scrollStep;
      await page.waitForTimeout(scrollDelay);
    }
  
  }

async function delay(time) {

    const timer = ms => new Promise(res => setTimeout(res, ms))

    return await timer(time);
}


module.exports = {
    scrollPage,
    delay
}

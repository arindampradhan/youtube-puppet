import puppeteer from "puppeteer";
import { YOUTUBE_TRANSCRIPT } from "./constants.js"; // Update the file extension to .mjs
import {
  addTranscript,
  getYoutubeUrls,
  checkifTranscriptDoesNotExists,
  addError,
} from "./saveindb.js";
import {sleep} from './helper.js'

const downloadScript = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  const youtubes = await getYoutubeUrls();

  // Navigate to the URL
  for await (const youtube of youtubes) {
    const { url: youtubeUrl, videoId } = youtube;
    if (checkifTranscriptDoesNotExists(videoId)) {
      try {
        await page.goto(YOUTUBE_TRANSCRIPT);

        // Fill out the form
        await page.type("#video_url", youtubeUrl);
  
        // Submit the form
        const [element] = await page.$x(
          "/html/body/header/div[2]/div/div[2]/form/div/div[2]/button"
        );
  
        await element.click(); // Replace with actual submit button ID
        await page.setDefaultNavigationTimeout(0);
        await sleep(4000);

        // check if transcript is disabled for this video
        // it is disabled if the header_text is "Error: transcripts disabled for that video"
        const headerText = await page.evaluate(() => {
          const header = document.querySelector("#header_text");
          return header.textContent;
        })

        if(headerText === "Error: transcripts disabled for that video") {
          throw new Error(`Transcript is disabled for this video youtube_url ${youtubeUrl}`)
        }
        
        await page.waitForSelector("#demo", { visible: true });
  
        const elm = await page.$("#demo");
        const text = await page.evaluate((el) => el.textContent, elm);
        addTranscript(videoId, text);  
      } catch (error) {
        addError(videoId, error.toString())
      }
    }
  }
  browser.close();
};

downloadScript();

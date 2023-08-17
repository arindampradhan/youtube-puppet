import puppeteer from "puppeteer";
import { YOUTUBE_TRANSCRIPT } from "./constants.js"; 
import {
  addTranscript,
  getYoutubeUrls,
  checkifTranscriptDoesNotExists,
  addError,
} from "./saveindb.js";
import {sleep} from './helper.js'


const YOUTUBE_CHANNEL = 'https://www.youtube.com/@AlexHormozi'


(async () => {
  // write a puppeteer script to get all the playlists from a youtube channel

  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: false,
  });

  const playlistUrl = `${YOUTUBE_CHANNEL}/playlists`

  // Create a new page
  const page = await browser.newPage();
  page.goto(playlistUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#contents');

  const playListAtagXpath = '//*[@id="view-more"]/a'
  
  // get all links from playListAtagXpath
  const linksFormatted = await page.evaluate((playListAtagXpath) => {
    const playlistItems = document.querySelectorAll(playListAtagXpath);
    const linksArray = [];

    for (const item of playlistItems) {
      linksArray.push(item.href);
    }

    return linksArray;
  }, playListAtagXpath);
  
})();
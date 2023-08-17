import puppeteer from 'puppeteer';
import { addYoutubeUrl } from './saveindb.js'; // Update the file extension to .mjs
import { PLAYLIST_URLS } from './constants.js'; // Update the file extension to .mjs
import { hasVideoId } from './helper.js'

(async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    headless: true,
  });

  // Create a new page
  const page = await browser.newPage();

  // URL of the YouTube playlist
  for await (const playlistUrl of PLAYLIST_URLS) {
    // Navigate to the playlist URL
    await page.goto(playlistUrl, { waitUntil: 'domcontentloaded' });
  
    // Wait for the playlist content to load
    await page.waitForSelector('#contents');
  
    // Extract links from playlist items
    const linksFormatted = await page.evaluate(() => {
      const playlistItems = document.querySelectorAll('a#thumbnail');
      const linksArray = [];
  
      for (const item of playlistItems) {
        const videoId = item.href.split('v=')[1];
        linksArray.push({ link:`https://www.youtube.com/watch?v=${videoId}`, videoId });
      }
  
      return linksArray;
    });
    linksFormatted.forEach(({link, videoId}) => {
      if(hasVideoId(link)){
        addYoutubeUrl(link, videoId)
      }
    })
  }
  // Close the browser
  await browser.close();
})();

import puppeteer from 'puppeteer';
import { YOUTUBE_TRANSCRIPT } from './constants.js'; // Update the file extension to .mjs
import { addTranscript, getYoutubeUrls, checkifTranscriptExists } from './saveindb.js';

const downloadScript = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  const youtubes = await getYoutubeUrls();
  
  // Navigate to the URL
  for await (const youtube of youtubes) {
    const { url: youtubeUrl, videoId } = youtube;
    await page.goto(YOUTUBE_TRANSCRIPT);
    
    // Fill out the form
    await page.type('#video_url', youtubeUrl);

    // Submit the form
    const [element] = await page.$x('/html/body/header/div[2]/div/div[2]/form/div/div[2]/button')

    await element.click(); // Replace with actual submit button ID

    // Wait for navigation to complete
    await page.waitForNavigation({waitUntil:"domcontentloaded", timeout: 10000});
    
    await page.waitForSelector('#demo', {visible: true})

    const elm = await page.$('#demo')
    const text = await page.evaluate(el => el.textContent, elm)
    if(checkifTranscriptExists(videoId)){
      addTranscript(videoId, text)
    }
  };
}

downloadScript()
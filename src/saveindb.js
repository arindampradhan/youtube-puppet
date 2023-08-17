// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {  LowSync } from 'lowdb'
import {  JSONFileSync } from 'lowdb/node'
import lodash from 'lodash'

const addChain = (db) => {
  db.chain = lodash.chain(db).get('data')
}

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname,'..', 'db.json')
const adapter = new JSONFileSync(file)
const defaultData = { transcripts: [], youtubeUrls: [] }
const db = new LowSync(adapter, defaultData)
addChain(db);

export const getYoutubeUrls = async (videoId) => {
  db.read()
  return db.chain.get('youtubeUrls')
}

export const checkifTranscriptExists = (videoId) => {
  db.read()
  return db.chain.get('transcripts').find({videoId}).value();
}

export const addYoutubeUrl = async (url, videoId) => {
  const youtubeUrlDocument = {
    _id: new Date().toISOString(),
    url,
    videoId
  };
  try {
    await db.data.youtubeUrls.push(youtubeUrlDocument)
    await db.write();
    console.log('URL saved');
  } catch (error) {
    console.error('Error saving URL:', error);
  }
}

export const addTranscript = async (videoId, text) => {
  const transcriptDocument = {
    _id: new Date().toISOString(), // Use a suitable ID format
    text,
    videoId,
  };

  try {
    await db.data.transcripts.push(transcriptDocument)
    await db.write();
    console.log('Transcript saved');
  } catch (error) {
    console.error('Error saving URL:', error);
  }
};

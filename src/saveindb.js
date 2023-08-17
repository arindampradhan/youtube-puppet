// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {  LowSync } from 'lowdb'
import {  JSONFileSync } from 'lowdb/node'
import lodash from 'lodash'
import fs from 'fs-extra'
import path from 'path'

const addChain = (db) => {
  db.chain = lodash.chain(db).get('data')
}

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname,'..', 'db.json')
const adapter = new JSONFileSync(file)
const defaultData = { transcripts: [], youtubeUrls: [], errors: [] }
const db = new LowSync(adapter, defaultData)
addChain(db);

export const getYoutubeUrls = async (videoId) => {
  db.read()
  return db.chain.get('youtubeUrls')
}

export const checkifTranscriptDoesNotExists = (videoId) => {
  db.read();
  const existsInError = db.chain.get('errors').find({ videoId }).value();
  const existsInTranscript = db.chain.get('transcripts').find({ videoId }).value();
  return !existsInError && !existsInTranscript
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

export const addError = async (videoId, error) => {
  const errorDocument = {
    _id: new Date().toISOString(), // Use a suitable ID format
    error,
    videoId,
  };
  try {
    await db.data.errors.push(errorDocument)
    await db.write();
    console.log('Error saved');
  } catch (error) {
    console.error('Error saving URL:', error);
  }
}

export const saveTranscriptToFile = async () => {
  // TODO: Save transcript to file
  db.read()
  const allTranscripts = await db.chain.get('transcripts').value();
  console.log(allTranscripts)

  allTranscripts.forEach(({videoId, text}) => {
    console.log('Saving transcript to file');
    const filePath = path.join(__dirname, '..', 'transcripts', `${lodash.uniqueId('transcript')}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Transcript saved to file');
    })
  })
};
import fs from 'fs';
import fastcsv from 'fast-csv';
import csv from 'csv-parser';
import { query } from './setup.js';

export async function csvToDB() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertEpisodes(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

// VIRKAR EKKI WTF
export async function readEpisodes() {
  let stream = fs.createReadStream("./episodes.csv");
  let csvData = [];
  let csvStream = fastcsv.parse().on("data",function(data) {
      csvData.push(data);
    }).on("end", function() {
      csvData.shift();
    });

  console.log(csvData);
  stream.pipe(csvStream);

  try {
    csvData.forEach(async (row) => {
      await insertEpisodes(row);
    } )
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

async function insertEpisodes(data) {
  const q = "INSERT INTO episodes (name,number,airDate,description,seasonsID) VALUES ($1,$2,$3,$4,$5)";

  if (data.airDate === '') data.airDate = null;
  try {
    await query(q, 
      [
        data.name,
        data.number,
        data.airDate,
        data.overview,
        data.season
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

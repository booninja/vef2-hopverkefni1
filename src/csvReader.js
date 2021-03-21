import fs from 'fs';
// import fastcsv from 'fast-csv';
import csv from 'csv-parser';
import { query } from './setup.js';

export async function readSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertSeries(row);
      await insertCategories(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

<<<<<<< Updated upstream
async function insertSeries(data) {
  const q = `INSERT INTO series 
              (name,airDate,inProduction,tagline,poster,description,language,network,website)
=======
export async function readSeriesToCategories() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertSeriesToCategories(row);
    })
    .on('end', () => {
      console.info('CSV file successfully processed');
    });
}

export async function readSeasons() {
  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertSeasons(row);
      // await insertImages(row);
    })
    .on('end', () => {
      console.info('CSV file successfully processed');
    });
}

export async function readEpisodes() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await insertEpisodes(row);
    })
    .on('end', () => {
      console.info('CSV file successfully processed');
    });
}

export async function insertSeries(data) {
  const q = `INSERT INTO series
              (name,airDate,inProduction,tagline,poster,description,language,network,homepage)
>>>>>>> Stashed changes
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

  if (data.airDate === '') data.airDate = null;
  if (data.poster === null) data.poster = 'hallo';
  try {
    await query(q, 
      [
        data.name,
        data.airDate,
        data.inProduction,
        data.tagline,
        `https://res.cloudinary.com/vefforritun-hop1-rovv/image/upload/${data.image}`,
        data.description,
        data.language,
        data.network,
<<<<<<< Updated upstream
        data.website
=======
        data.homepage,
>>>>>>> Stashed changes
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

export async function readSeasons() {

  fs.createReadStream('./data/seasons.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertSeasons(row);
      // await insertImages(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function insertSeasons(data) {
  const q = `INSERT INTO seasons (name,number,airDate,description,poster,seriesID)
              VALUES ($1,$2,$3,$4,$5,$6)`;

  if (data.airDate === '') data.airDate = null;
  try {
    await query(q, 
      [
        data.name,
        data.number,
        data.airDate,
        data.description,
        `https://res.cloudinary.com/vefforritun-hop1-rovv/image/upload/${data.poster}`,
        data.seriesID
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

export async function readEpisodes() {
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

<<<<<<< Updated upstream
// VIRKAR EKKI WTF
// export async function readEpisodes() {
//   let stream = fs.createReadStream("./episodes.csv");
//   let csvData = [];
//   let csvStream = fastcsv.parse().on("data",function(data) {
//       csvData.push(data);
//     }).on("end", function() {
//       csvData.shift();
//     });
=======
  const q2 = `SELECT id FROM seasons
              WHERE number = $1
              AND serieID = $2`;
>>>>>>> Stashed changes

//   console.log(csvData);
//   stream.pipe(csvStream);

//   try {
//     csvData.forEach(async (row) => {
//       await insertEpisodes(row);
//     } )
//   } catch (e) {
//     console.error('Villa við að bæta gögnum við', e);
//   }
// }

async function insertEpisodes(data) {
  const q = `INSERT INTO episodes (name,number,airDate,description,seasonsID) 
              VALUES ($1,$2,$3,$4,$5)`;

  if (data.airDate === '') data.airDate = null;
  try {
    await query(q, 
      [
        data.name,
        data.number,
        data.airDate,
        data.overview,
        data.seasonsID
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

async function insertCategories(data) {
  const categories = data.genres.split(",");
  const q = `INSERT INTO categories (name) VALUES ($1)
              ON CONFLICT DO NOTHING`;
  
  categories.forEach(async (category) => {
    try {
      await query(q, [category]);
    } catch (e) {
      console.error('Villa við að bæta gögnum við', e);
    }
  });
}


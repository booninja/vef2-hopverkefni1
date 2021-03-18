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
      console.info('CSV file successfully processed');
    });
}

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

export async function insertSeries(data) {
  const q = `INSERT INTO series
              (id, name,airDate,inProduction,tagline,poster,description,language,network,website)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

  if (data.airDate === '') data.airDate = null;
  if (data.poster === null) data.poster = 'hallo';
  console.log('Series:>> ', data.id);

  try {
    await query(q,
      [
        parseInt(data.id),
        data.name,
        data.airDate,
        data.inProduction,
        data.tagline,
        `https://res.cloudinary.com/vefforritun-hop1-rovv/image/upload/${data.image}`,
        data.description,
        data.language,
        data.network,
        data.website,
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í series', e);
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
  const q = `INSERT INTO seasons (name,number,airDate,description,poster,serieID)
              VALUES ($1,$2,$3,$4,$5,$6)`;

  if (data.airDate === '') data.airDate = null;
  console.log('Season:>> ', data.serieId);
  try {
    await query(q,
      [
        data.name,
        parseInt(data.number),
        data.airDate,
        data.overview,
        `https://res.cloudinary.com/vefforritun-hop1-rovv/image/upload/${data.poster}`,
        parseInt(data.serieId),
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í seasons', e);
  }
}

export async function readEpisodes() {
  fs.createReadStream('./data/episodes.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await insertEpisodes(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

// VIRKAR EKKI WTF
// export async function readEpisodes() {
//   let stream = fs.createReadStream("./episodes.csv");
//   let csvData = [];
//   let csvStream = fastcsv.parse().on("data",function(data) {
//       csvData.push(data);
//     }).on("end", function() {
//       csvData.shift();
//     });

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
  const q = `INSERT INTO episodes (name,number,airDate,description, seasonNumber, season,  serieID)
  VALUES ($1,$2,$3,$4,$5, $6, $7)`;
  const q2 = `SELECT id FROM seasons WHERE number = $1 AND serieID = $2`;
  if (data.airDate === '') data.airDate = null;
  // console.log(typeof(data.number), ', ', typeof(data.serieId));
  try {
    const result = await query(q2, [data.season, data.serieId]);
    // console.log(data)
    if(!result[0]) console.log(result);
    await query(q,
      [
        data.name,
        parseInt(data.number),
        data.airDate,
        data.overview,
        data.season,
        data.serie,
        data.serieId
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í Episodes ', e);
  }
}

async function insertCategories(data) {
  const categories = data.genres.split(',');
  const q = `INSERT INTO categories (name) VALUES ($1)
              ON CONFLICT DO NOTHING`;
  categories.forEach(async (category) => {
    try {
      await query(q, [category]);
    } catch (e) {
      console.error('Villa við að bæta gögnum við inn í Categories ', e);
    }
  });
}

async function insertSeriesToCategories(data) {
  const categories = data.genres.split(',');
  const q = 'SELECT id FROM categories WHERE $1 LIKE name';
  const q2 = 'INSERT INTO seriesToCategories (serieID, categoryID) VALUES ($1, $2)';
  categories.forEach(async (category) => {
    try {
      const resultId = await query(q, [category]);
      await query(q2, [parseInt(data.id), resultId[0].id]);
    } catch (e) {
      console.error('Villa við að bæta gögnum við', e);
    }
  });
}

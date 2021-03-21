/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable radix */
import fs from 'fs';
// import fastcsv from 'fast-csv';
import csv from 'csv-parser';
import { v2 as cloudinary } from 'cloudinary';
import { query } from './utils.js';

cloudinary.config({
  cloud_name: 'vefforritun-hop1-rovv',
  api_key: '579452795597197',
  api_secret: 'LAHnLbWZvxPl_6U3YOLeNCJiQ6w',
});

export async function readSeries() {
  fs.createReadStream('./data/series.csv')
    .pipe(csv())
    .on('data', async (row) => {
      // console.log(row);
      await insertSeries(row);
      await insertCategories(row);
      setTimeout(async function() {
        await insertSeriesToCategories(row);
      }, 1000);
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
              (id, name,airDate,inProduction,tagline,poster,description,language,network,website)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;

  if (data.airDate === '') data.airDate = null;
  if (data.poster === null) data.poster = 'hallo';

  try {
    await query(q,
      [
        parseInt(data.id),
        data.name,
        data.airDate,
        data.inProduction,
        data.tagline,
        cloudinary.url(data.image),
        data.description,
        data.language,
        data.network,
        data.website,
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í series', e);
  }
}

async function insertSeasons(data) {
  const q = `INSERT INTO seasons (name,number,airDate,description,poster,serieID)
              VALUES ($1,$2,$3,$4,$5,$6)`;

  if (data.airDate === '') data.airDate = null;
  try {
    await query(q,
      [
        data.name,
        parseInt(data.number),
        data.airDate,
        data.overview,
        cloudinary.url(data.poster),
        parseInt(data.serieId),
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í seasons', e);
  }
}

export async function insertSeasonsById(data, id) {
  const q = `INSERT INTO seasons (name,number,airDate,description,poster,serieID)
              VALUES ($1,$2,$3,$4,$5,$6)`;

  if (data.airDate === '') data.airDate = null;
  try {
    await query(q,
      [
        data.name,
        parseInt(data.number),
        data.airDate,
        data.description,
        cloudinary.url(data.poster),
        parseInt(id),
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í seasons', e);
  }
}

async function insertEpisodes(data) {
  const q = `INSERT INTO episodes (name,number,airDate,description, seasonNumber, season,  serieID)
  VALUES ($1,$2,$3,$4,$5, $6, $7)`;

  const q2 = `SELECT id FROM seasons 
              WHERE number = $1 
              AND serieID = $2`;

  if (data.airDate === '') data.airDate = null;

  try {
    await query(q2, [data.season, data.serieId]);

    await query(q,
      [
        data.name,
        parseInt(data.number),
        data.airDate,
        data.overview,
        data.season,
        data.serie,
        data.serieId,
      ]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í Episodes ', e);
  }
}

export async function insertCategories(data) {
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

export async function singleInsertCategories(data) {
  const q = `INSERT INTO categories (name) VALUES ($1)
              ON CONFLICT DO NOTHING`;
  try {
    await query(q, [data.name]);
  } catch (e) {
    console.error('Villa við að bæta gögnum við inn í hér ', e);
  }
}

async function insertSeriesToCategories(data) {
  const categories = data.genres.split(',');
  const q = 'SELECT id FROM categories WHERE $1 LIKE name';
  const q2 = 'INSERT INTO seriesToCategories (serieID, categoryID) VALUES ($1, $2)';
  categories.forEach(async (category) => {
    try {
      const resultId = await query(q, [category]);
      await query(q2, [parseInt(data.id), resultId.rows[0].id]);
    } catch (e) {
      console.error('Villa við að bæta gögnum við', e);
    }
  });
}

// export async function readSeries() {
//   fs.createReadStream('./data/series.csv')
//     .pipe(csv())
//     .on('data', async (row) => {
//       // console.log(row);
//       await insertSeries(row);
//       await insertCategories(row);
//     })
//     .on('end', () => {
//       console.info('CSV file successfully processed');
//     });
// }

// export async function readSeasons() {
//   fs.createReadStream('./data/seasons.csv')
//     .pipe(csv())
//     .on('data', async (row) => {
//       // console.log(row);
//       await insertSeasons(row);
//       // await insertImages(row);
//     })
//     .on('end', () => {
//       console.info('CSV file successfully processed');
//     });
// }

// export async function readEpisodes() {
//   fs.createReadStream('./data/episodes.csv')
//     .pipe(csv())
//     .on('data', async (row) => {
//       await insertEpisodes(row);
//     })
//     .on('end', () => {
//       console.info('CSV file successfully processed');
//     });
// }

// export async function readSeriesToCategories() {
//   fs.createReadStream('./data/series.csv')
//     .pipe(csv())
//     .on('data', async (row) => {
//       // console.log(row);
//       await insertSeriesToCategories(row);
//     })
//     .on('end', () => {
//       console.info('CSV file successfully processed');
//     });
// }

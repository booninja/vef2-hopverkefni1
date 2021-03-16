/* eslint-disable no-plusplus */
import pg from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { readSeries, readSeasons, readEpisodes } from './csvReader.js';

async function readFileAsync(sql) {
  try {
    const file = await fs.readFile(sql);
    return file;
  } catch (e) {
    throw new Error(e);
  }
}

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

if (!connectionString) {
  console.error('Vantar DATABASE_URL');
  process.exit(1);
}

const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, v = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(q, v);
    return result.rows;
  } catch (e) {//eslint-disable-line
    throw e;
  } finally {
    client.release();
  }
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS series, categories, seasons, episodes, users CASCADE');
  console.info('Töflu eytt');

  // búa til töflu út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  // bæta færslum við töflu
  try {
    await readSeries();
    console.log('Þáttaröðum bætt við gagnagrunn');

    await readSeasons();
    console.log('Þáttaseríum bætt við gagnagrunn');

    await readEpisodes();
    console.log('Þáttum bætt við gagnagrunn');

  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

// main().catch((err) => {
//   console.error(err);
// });

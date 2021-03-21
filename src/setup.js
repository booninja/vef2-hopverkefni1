/* eslint-disable no-plusplus */
import pg from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { setupMaster } from 'cluster';
import { readSeries, readSeasons, readEpisodes } from './csvReader.js';
import { createAdmin, createUser } from './userQueries.js';

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

async function setUpUser() {
  const q = `INSERT INTO SerieToUser (serieID,userID,status) 
              VALUES (1,2,'Langar að horfa')`;
  const q2 = `INSERT INTO SerieToUser (serieID,userID,status) 
              VALUES (2,2,'Hef horft')`;
  const q3 = `INSERT INTO SerieToUser (serieID,userID,grade) 
              VALUES (3,2,4)`;
  const q4 = `INSERT INTO SerieToUser (serieID,userID,grade) 
              VALUES (4,2,2)`;

  try {
    await query(q);
    await query(q2);
    await query(q3);
    await query(q4);
  } catch (e) {
    console.error('Villa við að bæta við gögnum', e);
  }
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS series, categories, seasons, episodes, users, seriestocategories, SerieToUser CASCADE');
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
    await createAdmin({ name: 'admin', email: 'osh16@hi.is', password: '123' });
    await createUser({ name: 'notandi', email: 'ios24@hi.su', password: '123' });
    await readSeries();
    console.info('Þáttaröðum bætt við gagnagrunn');
    await readSeasons();
    console.info('Þáttaseríum bætt við gagnagrunn');
    await readEpisodes();
    console.info('Þáttum bætt við gagnagrunn');
    setTimeout(async () => { await setUpUser(); }, 1000);
    console.info('Tengutafla búin til');
  } catch (e) {
    console.error('Villa við að bæta gögnum við', e);
  }
}

main().catch((err) => {
  console.error(err);
});

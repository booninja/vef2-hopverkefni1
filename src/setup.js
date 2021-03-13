/* eslint-disable no-plusplus */
import pg from 'pg';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

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

async function insert(data) {
  const q = `
INSERT INTO signatures
(name, nationalId, signed, comment, anonymous)
VALUES
($1, $2, $3, $4, $5)`;
  return query(q, data);
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
    await query('\\COPY episodes FROM \'C:\\Users\\Jack\\Documents\\Tölvunarfræði\\Vor 2021\\Vefforritun 2\\vef2-verkefni\\vef2-2021-h1\\data\\episodes.csv\' DELIMITER \',\' CSV HEADER');
    // const insert = await readFileAsync('./sql/fake.sql');
    // await query(insert.toString('utf8'));
    // for (let i = 0; i < 500; i++) {
    //   insert(fakeSignatures());
    // }
    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});

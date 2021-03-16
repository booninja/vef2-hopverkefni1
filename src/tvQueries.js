import { query } from './utils.js';

export async function getAllSeries() {
  const q = `SELECT * FROM series`;
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getSerieByID(id) {
  const q = `SELECT * FROM series WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function deleteSerieByID(id) {
  const q = `DELETE FROM series WHERE id = $1`;

  try {
    await query(q, [id]);
    console.log('sería deletuð');
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function getAllSeasons() {
  const q = `SELECT * FROM seasons`;
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getSeasonByID(id) {
  const q = `SELECT * FROM seasons WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function deleteSeasonByID(id) {
  const q = `DELETE FROM seasons WHERE id = $1`;

  try {
    await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function getAllEpisodes() {
  const q = `SELECT * FROM episodes`;
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getEpisodeByID(id) {
  const q = `SELECT * FROM episodes WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function deleteEpisodeByID(id) {
  const q = `DELETE FROM episodes WHERE id = $1`;

  try {
    await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}


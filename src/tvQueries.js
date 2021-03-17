import { query, addPageMetadata } from './utils.js';

const lim = 10;

export async function getAllSeries() {
  const q = 'SELECT * FROM series';
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result;
}
export async function listSeries(offset = 0, limit = 10, search = '') {
  const values = [offset, limit];

  let searchPart = '';
  if (search) {
    searchPart = `
        WHERE
        to_tsvector('english', name) @@ plainto_tsquery('english', $3)
        OR
        to_tsvector('english', comment) @@ plainto_tsquery('english', $3)
      `;
    values.push(search);
  }

  let result = [];

  try {
    const q = `
      SELECT * FROM series  ${searchPart}
        OFFSET $1 LIMIT $2
      `;

    const queryResult = await query(q, values);

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting signatures', e);
  }
  return result;
}

export async function getSerieById(id) {
  // if (!isInt(id)) {
  //   return null;
  // }

  const q = 'SELECT * FROM series WHERE id = $1';
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }

  if (result.rows.length !== 1) {
    return null;
  }
  console.info(result.rows);
  return result.rows;
}

// Gæti þurft að laga
export async function editSerieById(id, data) {
  const q = `UPDATE serie
              SET name = $1,
              SET airDate = $2,
              SET inProduction = $3,
              SET tagline = $4,
              SET poster = $5,
              SET description = $6,
              SET language = $7,
              SET network = $8,
              SET website = $9
              WHERE id = $10`;
  
  try {
    result = await query(q, 
      [ data.name,
        data.airDate,
        data.inProduction,
        data.tagline,
        data.poster,
        data.description,
        data.language,
        data.network,
        data.website,
        id
    ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSerieById(id) {
  const q = `DELETE FROM series WHERE id = $1`;

  try {
    await query(q, [id]);
    console.log('sería deletuð');
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function getAllSeasons() {
  const q = 'SELECT * FROM seasons';
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getSeasonById(id) {
  const q = `SELECT * FROM seasons WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

// Gæti þurft að laga
export async function editSeasonById(id, data) {
  const q = `UPDATE serie
              SET name = $1,
              SET number = $2,
              SET airDate = $3,
              SET description = $4,
              SET poster = $5,
              SET seriesID = $6,
              WHERE id = $7`;
  
  try {
    result = await query(q, 
      [ data.name,
        data.number,
        data.airDate,
        data.description,
        data.poster,
        data.seriesID,
        id
    ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSeasonById(id) {
  const q = `DELETE FROM seasons WHERE id = $1`;

  try {
    await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function getAllEpisodes() {
  const q = 'SELECT * FROM episodes';
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getEpisodeById(id) {
  const q = `SELECT * FROM episodes WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getEpisodeByUser(episodeID, userID) {
  const q = `SELECT * FROM EpisodeToUser WHERE
              episodeID = $1 AND userID = $2`;
  
  let result;
  try {
    result = await query(q, [episodeID, userID]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

// Gæti þurft að laga
export async function editEpisodeById(id, data) {
  const q = `UPDATE serie
              SET name = $1,
              SET number = $2,
              SET airDate = $3,
              SET description = $4,
              SET seasonsID = $5,
              WHERE id = $7`;
  
  try {
    result = await query(q, 
      [ data.name,
        data.number,
        data.airDate,
        data.description,
        data.seasonsID,
        id
    ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

// Gæti þurft að laga
export async function updateEpisodeStatus(id, episodeID, userID, status) {
  const q = `UPDATE EpisodeToUser SET status = $1
              WHERE id = $2 AND episodeID = $3 AND userID = $4`;
  
  let result;
  try {
    result = await query(q, 
      [ status,
        id,
        episodeID,
        userID
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

// Gæti þurft að laga
export async function updateEpisodeRating(id, episodeID, userID, rating) {
  const q = `UPDATE EpisodeToUser SET rating = $1
              WHERE id = $2 AND episodeID = $3 AND userID = $4`;
  
  let result;
  try {
    result = await query(q, 
      [ rating,
        id,
        episodeID,
        userID
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteEpisodeById(id) {
  const q = `DELETE FROM episodes WHERE id = $1`;

  try {
    await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

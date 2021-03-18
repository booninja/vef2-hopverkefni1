import { query, addPageMetadata } from './utils.js';

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
    console.error('Villa við að sækja serieID', e);
  }

  if (result.rows.length !== 1) {
    return null;
  }
  // console.info(result.rows);
  return result.rows;
}

export async function getGenreBySerieId(id) {
  const q = 'SELECT c.name FROM categories c JOIN seriesToCategories ON seriesToCategories.categoryID = c.id WHERE seriesToCategories.serieid = $1';
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja serieID', e);
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
        data.id,
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

export async function getSeasonsByID(id) {
  const q = 'SELECT * FROM seasons WHERE serieid = $1';
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getSeasonById(id, season) {
  const q = `SELECT * FROM seasons WHERE serieID = $1 AND number = $2`;
  let result;
  try {
    result = await query(q, [id, season]);
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
              SET serieID = $6,
              WHERE id = $7`;

  try {
    result = await query(q,
      [ data.name,
        data.number,
        data.airDate,
        data.description,
        data.poster,
        data.serieID,
        id
    ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSeasonById(serieId, season) {
  const q = `DELETE FROM seasons WHERE serieID = $1 and number = $2`;

  try {
    await query(q, [serieId, season]);
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

export async function getEpisodeById(id, season, episode) {
  const q = `SELECT * FROM episodes WHERE serieID = $1 AND season = $2 AND number = $3`;
  let result;
  try {
    result = await query(q, [id, season, episode]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function deleteEpisodeById(id, season, episode) {
  const q = `DELETE FROM episodes WHERE serieID = $1 AND season = $2 AND number = $3`;

  try {
    await query(q, [id, season, episode]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
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
/*
export async function getGenressd() {
  const q = `SELECT * FROM categories`;
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}
*/

export async function getGenres(offset = 0, limit = 10, search = '') {
  const values = [offset, limit];
  console.log("hello");
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
    SELECT * FROM categories  ${searchPart}
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
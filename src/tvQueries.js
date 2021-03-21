// eslint-disable-next-line no-unused-vars
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

export async function getSeriesCount() {
  const q = 'SELECT COUNT(*) AS count FROM series';
  let result = '';
  try {
    result = await query(q);
  } catch (e) {
    console.info('Villa við að sækja fjölda', e);
  }
  const number = result.rows[0]
  return number;
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
        ORDER BY id ASC
        OFFSET $1 LIMIT $2
      `;

    const queryResult = await query(q, values);

    if (queryResult && queryResult.rows) {
      result = queryResult.rows;
    }
  } catch (e) {
    console.error('Error selecting tv series', e);
  }
  return result;
}

export async function getSerieById(id, offset = 0, limit = 10, search = '') {
  // if (!isInt(id)) {
  //   return null;
  // }
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

  const q = `SELECT * FROM series ${searchPart} WHERE id = $1`;
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

  if (result.rows.length === 0) {
    return null;
  }
  console.info(result.rows);
  return result.rows;
}


export async function editSerieById(id, data) {
  const q = `UPDATE series SET
              name = $1,
              airDate = $2,
              inProduction = $3,
              tagline = $4,
              poster = $5,
              description = $6,
              language = $7,
              network = $8,
              website = $9
              WHERE id = $10`;

  const beforeUpdate = await getSerieById(id);
  console.log(data);
  console.log('<<<', beforeUpdate);
  console.log("hvað er þetta", beforeUpdate.rows[0].name);

  const now = [
    data.name || beforeUpdate.name,
        data.airDate || beforeUpdate.airDate,
        data.inProduction ||  beforeUpdate.inProduction,
        data.tagline ||  beforeUpdate.tagline,
        data.poster || beforeUpdate.poster,
        data.description || beforeUpdate.description,
        data.language || beforeUpdate.language,
        data.network || beforeUpdate.network,
        data.website || beforeUpdate.website,
        id,
  ]
  console.log('hvernig', now);
  try {
    await query(q,
      [data.name || beforeUpdate.rows[0].name,
        data.airDate || beforeUpdate.rows[0].airDate,
        data.inProduction ||  beforeUpdate.rows[0].inProduction,
        data.tagline ||  beforeUpdate.rows[0].tagline,
        data.poster || beforeUpdate.rows[0].poster,
        data.description || beforeUpdate.rows[0].description,
        data.language || beforeUpdate.rows[0].language,
        data.network || beforeUpdate.rows[0].network,
        data.website || beforeUpdate.rows[0].website,
        id,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}
export async function deleteSerieById(id) {
  const q = `DELETE FROM series
             WHERE id = $1`;

  try {
    await query(q, [id]);
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
  const q = `SELECT * FROM seasons
             WHERE serieID = $1
             AND number = $2`;

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
  const q = `UPDATE serie SET
              name = $1,
              number = $2,
              airDate = $3,
              description = $4,
              poster = $5,
              serieID = $6
              WHERE id = $7`;

  try {
    await query(q,
      [data.name,
        data.number,
        data.airDate,
        data.description,
        data.poster,
        data.serieID,
        id,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSeasonById(serieId, season) {
  const q = `DELETE FROM seasons
             WHERE serieID = $1
             AND number = $2`;

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
  const q = `SELECT * FROM episodes
  WHERE serieID = $1
  AND seasonNumber = $2
  AND number = $3`;

  let result;
  try {
    result = await query(q, [id, season, episode]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function getEpisodesById(id, season) {
  const q = `SELECT name, number, airDate, description FROM episodes
  WHERE serieID = $1
  AND seasonNumber = $2`;
  let result;
  try {
    result = await query(q, [id, season]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
  return result.rows;
}

export async function deleteEpisodeById(id, season, episode) {
  const q = `DELETE FROM episodes WHERE serieID = $1
  AND seasonNumber = $2
  AND number = $3`;

  try {
    await query(q, [id, season, episode]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function getEpisodeByUser(episodeID, userID) {
  const q = `SELECT * FROM EpisodeToUser
  WHERE episodeID = $1
  AND userID = $2`;

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
  const q = `UPDATE serie SET
              name = $1,
              number = $2,
              airDate = $3,
              description = $4,
              seasonsID = $5
              WHERE id = $6`;

  try {
    await query(q,
      [ data.name,
        data.number,
        data.airDate,
        data.description,
        data.seasonsID,
        id,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

// Gæti þurft að laga
export async function setSerieRating(serieID, userID, data) {
  const q = `INSERT INTO SerieToUser (serieID,userID,grade)
              VALUES ($1,$2,$3)`;

  try {
    await query(q,
      [ serieID,
        userID,
        data.rating,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function updateSerieRating(serieID, userID, data) {
  const q = `UPDATE SerieToUser SET grade = $1
              WHERE serieID = $2 AND userID = $3`;

  try {
    await query(q,
      [ data.rating,
        serieID,
        userID,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSerieRating(serieID, userID) {
  const q = `DELETE FROM SerieToUser WHERE serieID = $1 AND
             userID = $2 AND status is null`;

  try {
    await query(q, [serieID, userID]);
  } catch (e) {
    console.error('Villa við að eyða gögnum', e);
  }
}

export async function setSerieStatus(serieID, userID, data) {
  const q = `INSERT INTO SerieToUser (serieID,userID,status)
              VALUES ($1,$2,$3)`;

  try {
    await query(q,
      [ serieID,
        userID,
        data.status,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function updateSerieStatus(serieID, userID, data) {
  const q = `UPDATE SerieToUser SET status = $1
              WHERE serieID = $2 AND userID = $3`;

  try {
    await query(q,
      [ data.status,
        serieID,
        userID,
      ]);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}

export async function deleteSerieStatus(serieID, userID) {
  const q = `DELETE FROM SerieToUser WHERE serieID = $1 AND
             userID = $2 AND grade is null`;

  try {
    await query(q, [serieID, userID]);
  } catch (e) {
    console.error('Villa við að eyða gögnum', e);
  }
}

// Gæti þurft að laga
// export async function updateSerieRating(id, serieID, userID, rating) {
//   const q = `UPDATE EpisodeToUser SET rating = $1
//               WHERE id = $2
//               AND episodeID = $3
//               AND userID = $4`;

//   try {
//     await query(q,
//       [rating,
//         id,
//         episodeID,
//         userID,
//       ]);
//   } catch (e) {
//     console.error('Villa við að sækja gögn', e);
//   }
// }
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
    SELECT name FROM categories  ${searchPart}
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

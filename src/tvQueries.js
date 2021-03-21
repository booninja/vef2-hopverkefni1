import { query } from './utils.js';


export async function getAllSeries() {
  const q = `SELECT * FROM series`;
  let result;
  try {
    result = await query(q);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
  return result.rows;
}

export async function getSerieByID(id) {
  const q = `SELECT * FROM series WHERE id = $1`;
  let result;
  try {
    result = await query(q, [id]);
  } catch (e) {
<<<<<<< Updated upstream
=======
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
              homepage = $9
              WHERE id = $10`;
    // const currData = await getSerieById(id);
    // console.log('>>>>', currData);

    // let newdata  = {
    //   name: data.name || currData.name,
    //   airdate: currData.airdate || data.airdate ,
    //   inProduction: data.inProduction || currData.inProduction,
    //   tagline: data.tagline || currData.tagline,
    //   poster: data.poster || currData.poster,
    //   description: data.description || currData.description,
    //   language: data.language || currData.language,
    //   network: data.network || currData.network,
    //   website: data.website || currData.website,
    // }
    // console.log('<<<<', newdata);
    console.log(data.tagline);
    console.log(data.name);
    console.log(data);
  try {
   await query(q,
      [
      ]);
      // await query(q,
      //   [newdata.name,
      //     newdata.airDate,
      //     newdata.inProduction,
      //     newdata.tagline,
      //     newdata.poster,
      //     newdata.description,
      //     newdata.language,
      //     newdata.network,
      //     newdata.website,
      //     id,
      //   ]);

  } catch (e) {
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export async function deleteEpisodeByID(id) {
  const q = `DELETE FROM episodes WHERE id = $1`;

  try {
    await query(q, [id]);
=======
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
>>>>>>> Stashed changes
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
  }
}


import express from 'express';
import { body, validationResult } from 'express-validator';
import xss from 'xss';

import { catchErrors, setPagenumber, PAGE_SIZE } from '../src/utils.js';
import {
  getSerieById,
  getGenreBySerieId,
  listSeries,
  getSeasonById,
  getSeasonsByID,
  getSeasonsCount,
  getEpisodeById,
  getEpisodesById,
  deleteSerieById,
  deleteEpisodeById,
  deleteSeasonById,
  getGenres,
  getGenreCount,
  setSerieRating, 
  updateSerieRating,
  deleteSerieRating,
  setSerieStatus, 
  updateSerieStatus,
  deleteSerieStatus,
  //updateEpisodeRating,
} from '../src/tvQueries.js';
import { requireAuthentication, requireAdminAuthentication} from '../src/users.js';

export const router = express.Router();

export async function readSerie(req, res) {
  const { id } = req.params;
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const series = await getSerieById(id);
  const genre = await getGenreBySerieId(id);
  const seasons = await getSeasonsByID(id);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(
    {
      limit,
      offset,
      items: { series, genre, seasons },
    },
  );
}

// export async function rateSerie(req, res) {

// }

export async function deleteSerie(req, res) {
  const { id } = req.params;

  await deleteSerieById(id);
  return res.json('Serie deleted');
}

export async function readSeasons(req, res) {
  const { id } = req.params;

  const series = await getSeasonsByID(id);
  const seasonsCount = await getSeasonsCount();
  console.log(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }

  const _links = {
    self: {
      href: `http://localhost:3000/tv/:id/season/offset=${offset}&limit=10`,
    },
  };

  if (offset + 10 < seasonsCount) {
    _links.next = {
      href: `http://localhost:3000/tv/:id/season/?offset=${offset + 10}&limit=10`,
    }
  }
  if (offset - 10 >= 0) {
    _links.prev = {
      href: `http://localhost:3000/tv/:id/season/?offset=${offset - 10}&limit=10`,
    };
  }

  res.json(
    {
      limit,
      offset,
      items: { series },
      _links,
    },
  );
}

export async function readSeason(req, res) {
  const { id, season } = req.params;
  const series = await getSeasonById(id, season);
  const episodes = await getEpisodesById(id, season);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json({ series, episodes });
}

export async function deleteSeason(req, res) {
  const { id, season } = req.params;

  await deleteSeasonById(id, season);
  return res.json('Season deleted');
}

export async function readEpisode(req, res) {
  const { id, season, episode } = req.params;

  const series = await getEpisodeById(id, season, episode);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(series);
}

export async function deleteEpisode(req, res) {
  const { id, season, episode } = req.params;

  await deleteEpisodeById(id, season, episode);
  return res.json('Season deleted');
}

export async function readGenres(req, res) {
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const registrations = await getGenres(offset, limit);
  const genreCount = await getGenreCount();

  const _links = {
    self: {
      href: `http://localhost:3000/genres/offset=${offset}&limit=10`,
    },
  };

  if (offset + 10 < genreCount) {
    _links.next = {
      href: `http://localhost:3000/genres?offset=${offset + 10}&limit=10`,
    }
  }
  if (offset - 10 >= 0) {
    _links.prev = {
      href: `http://localhost:3000/genres?offset=${offset - 10}&limit=10`,
    };
  }
  
  res.json(
    {
      limit,
      offset,
      items: { registrations },
      _links,
    },
  );
}





//router.get('/', catchErrors(getTv));// series

// ekki er kannað hvort það er rétt form með validation




// router.post('/tv/:id/rate', catchErrors(rateSeries));
// router.patch('/tv/:id/rate', catchErrors(rateSeries));
// router.delete('/tv/:id/rate', catchErrors(rateSeries));

export async function rateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await setSerieRating(id, req.user.id, data);
  console.log('Data rating changed');
  res.json(
    {
      user: req.user.username,
      rating: data.rating,
      serieid: id,
    },
  );
}

export async function updateRateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await updateSerieRating(id, req.user.id, data);
  console.log('Data rating changed');
  res.json(
    {
      user: req.user.username,
      rating: data.rating,
      serieid: id,
    },
  );
}

export async function deleteRateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;
  await deleteSerieRating(id, req.user.id);
  console.log('Data rating deleted');
  res.json(
    {
      user: req.user.username,
      rating: data.rating,
      serieid: id,
    },
  );
}

// router.post('/tv/:id/state', catchErrors(stateSeries));
// router.patch('/tv/:id/state', catchErrors(stateSeries));
// router.delete('/tv/:id/state', catchErrors(stateSeries));

export async function stateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;
  
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await setSerieStatus(id, req.user.id, data);
  console.log('Data status changed');
  res.json(
    {
      user: req.user.username,
      status: data.status,
      serieid: id,
    },
  );
}

export async function updateStateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;
  
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await updateSerieStatus(id, req.user.id, data);
  console.log('Data status changed');
  res.json(
    {
      user: req.user.username,
      status: data.status,
      serieid: id,
    },
  );
}

export async function deleteStateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;

  await deleteSerieStatus(id, req.user.id);
  console.log('Data status deleted');
  res.json(
    {
      user: req.user.username,
      status: data.status,
      serieid: id,
    },
  );
}

/*

  [{"id":2,"name":"Riverdale","airdate":"2017-01-26T00:00:00.000Z",
  "inproduction":true,"tagline":"Small town. Big secrets.",
  "poster":"https://res.cloudinary.com/vefforritun-hop1-rovv/image/upload/wRbjVBdDo5qHAEOVYoMWpM58FSA.jpg",
  "description":"Set in the present, the series offers a bold, subversive take on Archie, Betty, Veronica and their friends, exploring the surreality of small-town life, the darkness and weirdness bubbling beneath Riverdale’s wholesome facade.",
  "language":"en","network":"The CW","website":null}]

  {"id":2,"name":"Riverdale","air_date":"2017-01-26T00:00:00.000Z","in_production":true,
  "tagline":"Small town. Big secrets.",
  "image":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614710075/kynyzcgwtfsd7psbcjia.jpg",
  "description":"Set in the present, the series offers a bold, subversive take on Archie, Betty, Veronica and their friends, exploring the surreality of small-town life, the darkness and weirdness bubbling beneath Riverdale’s wholesome facade.",
  "language":"en","network":"The CW","url":null,
  "genres":[{"name":"Mystery"},{"name":"Drama"},{"name":"Crime"}],
  "seasons":[{"name":"Season 1","number":"1","air_date":"2017-01-26T00:00:00.000Z",
  "overview":null,
  "poster":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614709996/rzszyfluoxzljzbkkc1n.jpg"},
  {"name":"Season 2","number":"2","air_date":"2017-10-11T00:00:00.000Z","overview":null,
  "poster":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614710086/y9nnzghsaqrafdh1uku1.jpg"},
  {"name":"Season 3","number":"3","air_date":"2018-10-10T00:00:00.000Z","overview":null,
  "poster":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614709982/db58mk7njarp6f26fa5d.jpg"},
  {"name":"Season 4","number":"4","air_date":"2019-10-09T00:00:00.000Z","overview":null,
  "poster":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614709882/bdkmb3y86fdf12mcc1mi.jpg"},
  {"name":"Season 5","number":"5","air_date":"2021-01-20T00:00:00.000Z","overview":null,
  "poster":"https://res.cloudinary.com/dhy3vquyz/image/upload/v1614710075/kynyzcgwtfsd7psbcjia.jpg"}]}
  */

/*
async function validationCheck(req, res, next) {
  const {
    limit, offset, items, _links,
  } = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.json({ errors: validation.errors});
  }
  return next();
}
const validationMiddleware = [
  body('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),
];
*/

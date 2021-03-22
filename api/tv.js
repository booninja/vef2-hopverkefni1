import express from 'express';
import { validationResult } from 'express-validator';

import { setPagenumber } from '../src/utils.js';
import {
  getSerieById,
  getGenreBySerieId,
  getSeasonById,
  getSeasonsByID,
  getSeasonsCountBySerie,
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
  // updateEpisodeRating,
} from '../src/tvQueries.js';

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

export async function deleteSerie(req, res) {
  const { id } = req.params;

  await deleteSerieById(id);
  return res.json('Serie deleted');
}

export async function readSeasons(req, res) {
  const { id } = req.params;

  const seasons = await getSeasonsByID(id);
  const seasonsCount = await getSeasonsCountBySerie(id);

  if (!seasons) {
    return res.status(404).json({ error: 'Seasons not found' });
  }

  return res.json({ seasons });
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

  try {
    await deleteEpisodeById(id, season, episode);
    return res.json('Season deleted');
  } catch (e) {
    return res.status(500).json({ error: 'Could not delete season' });
  }
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
    };
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

export async function rateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await setSerieRating(id, req.user.id, data);
  console.info('Data rating changed');
  return res.json(
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
  console.info('Data rating changed');
  return res.json(
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
  console.info('Data rating deleted');
  return res.json(
    {
      user: req.user.username,
      rating: data.rating,
      serieid: id,
    },
  );
}

export async function stateSerie(req, res) {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await setSerieStatus(id, req.user.id, data);
  console.info('Data status changed');
  return res.json(
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
  console.info('Data status changed');
  return res.json(
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
  console.info('Data status deleted');
  return res.json(
    {
      user: req.user.username,
      status: data.status,
      serieid: id,
    },
  );
}

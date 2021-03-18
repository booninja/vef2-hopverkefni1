import express from 'express';
import { catchErrors, setPagenumber, PAGE_SIZE } from './utils.js';
import { getSerieByID, getGenreBySerieID, listSeries, getSeasonByID, getEpisodeByID } from './tvQueries.js';

export const router = express.Router();

async function tv(req, res) {
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const errors = [];

  const registrations = await listSeries(offset, limit);
  res.json(
    {
      limit,
      offset,
      items: { registrations },
      _links: {
        self: {
          href: req.query,
        },
        next: {
          href: req.query,
        },
      },
    },
  );
}

async function readSeries(req, res) {
  const { id } = req.params;

  const series = await getSerieByID(id);
  const genre = await getGenreBySerieID(id);
  const seasons = await getSeasonByID(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json({series, genre, seasons});
}

async function readSeasons(req, res) {
  const { id } = req.params;

  const series = await getSeasonByID(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(series);
}

async function readEpisode(req, res) {
  const { id } = req.params;

  const series = await getEpisodeByID(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(series);
}

// router.get('/tv', catchErrors(tv));// series

  // router.post('/tv', catchErrors(insertSeries)); //insertSeries

  router.get('/:id', catchErrors(readSeries));//series
  // router.patch('/tv/:id', catchErrors(updateSerie));
  // router.delete('/tv/:id', catchErrors(updateSerie));

  // router.post('/tv/:id/rate', catchErrors(rateSeries));
  // router.patch('/tv/:id/rate', catchErrors(rateSeries));
  // router.delete('/tv/:id/rate', catchErrors(rateSeries));

  // router.post('/tv/:id/state', catchErrors(stateSeries));
  // router.patch('/tv/:id/state', catchErrors(stateSeries));
  // router.delete('/tv/:id/state', catchErrors(stateSeries));

  router.get('/:id/season', catchErrors(readSeasons));
  router.get('/:id/season/{season}', catchErrors(readSeasons));
  // router.post('/tv/:id/season', catchErrors(readSeasons));

  // router.get('/tv/:id/season', catchErrors(readSeason));
  // router.delete('/tv/:id/season', catchErrors(readSeason));

  // router.post('/tv/{id}/season/{season}/episode', catchErrors(readEpisodes));

  router.get('/tv/{id}/season/{season}/episode/{episode}', catchErrors(readEpisode));
  // router.delete('/tv/{id}/season/{season}/episode/{episode}',  catchErrors(readEpisode));


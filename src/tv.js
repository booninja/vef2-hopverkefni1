import express from 'express';
import { catchErrors, setPagenumber, PAGE_SIZE } from './utils.js';
import { getSerieById, listSeries, getSeasonById, getEpisodeById } from './tvQueries.js';

export const router = express.Router();

async function getTv(req, res) {
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const errors = [];

  const registrations = await listSeries(offset, limit);
  console.log(registrations);
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

async function getSerie(req, res) {
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const errors = [];

  const registrations = await getSerie(offset, limit);
  console.log(registrations);
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
async function readSerie(req, res) {
  const { id } = req.params;

  const series = await getSerieById(id);
  const data = await getSeasonById(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json( {series,data} );
}

async function readSeasons(req, res) {
  const { id } = req.params;

  const series = await getSeasonById(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(series);
}

async function readEpisode(req, res) {
  const { id } = req.params;

  const series = await getEpisodeById(id);
  console.info(series);
  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }
  return res.json(series);
}






// router.get('/tv', catchErrors(tv));// series

 //  router.post('/tv', catchErrors(getTv)); //insertSeries

  router.get('/:id', catchErrors(readSerie));//serie
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
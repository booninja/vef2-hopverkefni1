import express from 'express';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import { catchErrors, setPagenumber, PAGE_SIZE } from '../src/utils.js';
import { listSeries, editSerieById, getSeriesCount, findByName} from '../src/tvQueries.js';
import {readSerie,
        rateSerie,
        updateRateSerie,
        deleteRateSerie,
        stateSerie,
        updateStateSerie,
        deleteStateSerie,
        deleteSerie,
        readSeasons,
        readSeason,
        deleteSeason,
        readEpisode,
        deleteEpisode,
        readGenres} from './tv.js'
import {NOTinsertSeries,
        insertSeries,
        insertSeasonsById,
        singleInsertCategories } from '../src/csvReader.js';
import { seriesValidation,
         genreValidation,
         serieValidation,
         seasonValidation,
         //patchSeriesValidation
         rateValidation,
         stateValidation
         } from './validating.js'
import { requireAuthentication, requireAdminAuthentication } from '../src/users.js';

export const router = express.Router();
async function indexRoute(req, res) {
  return res.json(
    {
      tv: {
        series: {
          href: '/tv', methods: ['GET', 'POST'],
        },
        serie: {
          href: '/tv/{id}', methods: ['GET', 'PATCH', 'DELETE'],
        },
        rate: {
          href: '/tv/{id}/rate', methods: ['POST', 'PATCH', 'DELETE'],
        },
        state: { href: '/tv/{id}/state', methods: ['POST', 'PATCH', 'DELETE'] },
      },
      seasons: {
        seasons: {
          href: '/tv/{id}/season', methods: ['GET', 'POST'],
        },
        season: {
          href: '/tv/{id}/season/{season}', methods: ['GET', 'DELETE'],
        },
      },
      episodes: {
        episodes: {
          href: '/tv/{id}/season/{season}/episode', methods: ['POST'],
        },
        episode: {
          href: '/tv/{id}/season/{season}/episode/{episode}', methods: ['GET', 'DELETE'],
        },
      },
      genres: {
        genres: {
          href: '/genres', methods: ['GET', 'POST'],
        },
      },
      users: {
        users: {
          href: '/users', methods: ['GET'],
        },
        user: {
          href: '/users/{id}', methods: ['GET', 'PATCH'],
        },
        register: {
          href: '/users/register', methods: ['POST'],
        },
        login: { href: '/users/login', methods: ['POST'] },
        me: {
          href: '/users/me', methods: ['GET', 'PATCH'],
        },
      },

    },
  );
}

async function getSeries(req, res,) {
  let { page = 1 } = req.query;
  const { offset = 0, limit = 10 } = req.query;

  page = setPagenumber(page);

  const registrations = await listSeries(offset, limit);
  const seriesCount = await getSeriesCount();

  const _links = {
    self: {
      href: `http://localhost:3000/tv/offset=${offset}&limit=10`,
    },
  };

  if (offset + 10 < seriesCount) {
    _links.next = {
      href: `http://localhost:3000/tv?offset=${offset + 10}&limit=10`,
    }
  }

  if (offset - 10 >= 0) {
    _links.prev = {
      href: `http://localhost:3000/tv?offset=${offset - 10}&limit=10`,
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

router.get('/', indexRoute);

async function createSerie(req, res) {
  const id = await getSeriesCount();
  const newSerie = {
    // eslint-disable-next-line radix
    id: parseInt(id) + 1,
    name: req.body.name,
    airDate: req.body.airDate,
    inProduction: req.body.inProduction,
    tagline: req.body.tagline,
    poster: req.body.image,
    description: req.body.description,
    language: req.body.language,
    network: req.body.network,
    homepage: req.body.homepage,
  };

  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  if (await findByName(newSerie.name)) {
    return res.status(400).json({ message: 'Sjónvarpsþáttur nú þegar til' });
  }

  try {
    await insertSeries(newSerie);
    return res.status(201).json({ message: `Sjónvarpsþáttur ${newSerie.name} búinn til` });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
}

router.post('/tv', seriesValidation, catchErrors(createSerie));
router.get('/tv', catchErrors(getSeries));
router.get('/genres', catchErrors(readGenres));

//virkar bara fyrir eitt genre í einu þarf mörg ?
router.post('/genres', requireAdminAuthentication, genreValidation, (req, res) => {
  const data = req.body;

  const validation = validationResult(data);

  if (!validation.isEmpty()) {
    console.log(' /genre post klikkaði');
    return res.status(404).json({ errors: validation.errors });
  }

  console.log('komst í gegnum validation');
  singleInsertCategories(data);
  res.json('þetta gekk');
});

router.get('/tv/:id', catchErrors(readSerie));// serie
router.delete('/tv/:id', requireAdminAuthentication, catchErrors(deleteSerie));

router.patch('/tv/:id',
//requireAdminAuthentication,
//patchSeriesValidation,
 async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }

  await editSerieById(id, data);
  res.json('þetta gekk');
});

router.get('/tv/:id/season',  catchErrors(readSeasons));
router.post('/tv/:id/season', requireAdminAuthentication, seasonValidation,  async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }
  await insertSeasonsById(data, id);
  return res.json('þetta gekk');
});

router.get('/tv/:id/season/:season', catchErrors(readSeason)); // vantar overview
router.delete('/tv/:id/season/:season', catchErrors(deleteSeason));

// router.post('/tv/{id}/season/{season}/episode', catchErrors(readEpisodes));

router.get('/tv/:id/season/:season/episode/:episode', catchErrors(readEpisode));
router.delete('/tv/:id/season/:season/episode/:episode', requireAdminAuthentication, catchErrors(deleteEpisode));

router.post('/tv/:id/rate', rateValidation, requireAuthentication, catchErrors(rateSerie));
router.patch('/tv/:id/rate', rateValidation, requireAuthentication, catchErrors(updateRateSerie));
router.delete('/tv/:id/rate', requireAuthentication, catchErrors(deleteRateSerie));

router.post('/tv/:id/state', stateValidation, requireAuthentication, catchErrors(stateSerie));
router.patch('/tv/:id/state', stateValidation, requireAuthentication, catchErrors(updateStateSerie));
router.delete('/tv/:id/state', requireAuthentication, catchErrors(deleteStateSerie));

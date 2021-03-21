import express from 'express';
import { body, validationResult } from 'express-validator';
import xss from 'xss';
import { catchErrors, setPagenumber, PAGE_SIZE } from '../src/utils.js';
import { listSeries, editSerieById, setSerieRating} from '../src/tvQueries.js';
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
import {insertSeries,
        insertSeasonsById,
        singleInsertCategories } from '../src/csvReader.js';
import { seriesValidation,
         genreValidation,
         serieValidation,
         seasonValidation,
         rateValidation,
         stateValidation } from './validating.js'
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

router.get('/', indexRoute);

router.get('/tv', catchErrors(getSeries));// series

router.post('/tv', requireAdminAuthentication, seriesValidation, (req, res) => {
  const data = req.body;
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    console.log(' /tv post klikkaði');
    return res.status(404).json({ errors: validation.errors });
  }
  else{
    console.log('komst í gegnum validation');
    insertSeries(data);
    res.json('þetta gekk');
  }
});

router.get('/genres', catchErrors(readGenres));

//virkar bara fyrir eitt genre í einu þarf mörg ?
router.post('/genres', requireAdminAuthentication, genreValidation, (req, res) => {
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    console.log(' /genre post klikkaði');
    return res.status(404).json({ errors: validation.errors });
  }
  else{
    console.log('komst í gegnum validation');
    singleInsertCategories(data);
    res.json('þetta gekk');
  }
});

router.get('/tv/:id', catchErrors(readSerie));// serie
router.delete('/tv/:id', requireAdminAuthentication, catchErrors(deleteSerie));

router.patch('/tv/:id', requireAdminAuthentication, serieValidation, (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }
  else{
    editSerieById(id, data);
    res.json('þetta gekk');
  }
});


router.get('/tv/:id/season',  catchErrors(readSeasons));
router.post('/tv/:id/season', requireAdminAuthentication, seasonValidation,  (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(404).json({ errors: validation.errors });
  }
  else{
      insertSeasonsById(data, id);
    res.json('þetta gekk');
  }
});


router.get('/tv/:id/season/:season', catchErrors(readSeason)); // vantar overview
router.delete('/:id/season/:season', requireAdminAuthentication, catchErrors(deleteSeason));

// router.post('/tv/{id}/season/{season}/episode', catchErrors(readEpisodes));

router.get('/tv/:id/season/:season/episode/:episode', catchErrors(readEpisode));
router.delete('/tv/:id/season/:season/episode/:episode', requireAdminAuthentication, catchErrors(deleteEpisode));

router.post('/tv/:id/rate', rateValidation, requireAuthentication, catchErrors(rateSerie));
router.patch('/tv/:id/rate', rateValidation, requireAuthentication, catchErrors(updateRateSerie));
router.delete('/tv/:id/rate', requireAuthentication, catchErrors(deleteRateSerie));

router.post('/tv/:id/state', stateValidation, requireAuthentication, catchErrors(stateSerie));
router.patch('/tv/:id/state', stateValidation, requireAuthentication, catchErrors(updateStateSerie));
router.delete('/tv/:id/state', requireAuthentication, catchErrors(deleteStateSerie));

// router.patch('/tv/:id/rate', catchErrors(rateSeries));
// router.delete('/tv/:id/rate', catchErrors(rateSeries));

// router.post('/tv/:id/state', catchErrors(stateSeries));
// router.patch('/tv/:id/state', catchErrors(stateSeries));
// router.delete('/tv/:id/state', catchErrors(stateSeries));










// hér fyrir neðan eru allar skipanirnar fyrir allar síðurnar, held að best er að
// taka eina í einu og vinna þannig niður



// hér fyrir neðan er það með kalli á autherazation fyrir user og admin,
// veit ekki hvort það var alltaf rétt að velja admin frekar en user ??

/*
  router.get('/tv', catchErrors(readSeries));//series
  router.post('/tv', requireAdmin, catchErrors(insertSeries)); //insertSeries

  router.get('/tv/:id', catchErrors(readSeries));//series
  router.patch('/tv/:id', requireAdmin, catchErrors(updateSerie));
  router.delete('/tv/:id', requireAdmin, catchErrors(updateSerie));

  router.post('/tv/:id/rate', catchErrors(rateSeries));
  router.patch('/tv/:id/rate', requireAdmin, catchErrors(rateSeries));
  router.delete('/tv/:id/rate', requireAuth, catchErrors(rateSeries));

  router.post('/tv/:id/state', catchErrors(stateSeries));
  router.patch('/tv/:id/state', requireAdmin, catchErrors(stateSeries));
  router.delete('/tv/:id/state', requireAuth, catchErrors(stateSeries));

  router.get('/tv/:id/season', catchErrors(readSeasons));
  router.post('/tv/:id/season', requireAdmin, catchErrors(readSeasons));

  router.get('/tv/:id/season', catchErrors(readSeason));
  router.delete('/tv/:id/season', requireAdmin, catchErrors(readSeason));

  router.post('/tv/{id}/season/{season}/episode', requireAdmin, catchErrors(readEpisodes));

  router.get('/tv/{id}/season/{season}/episode/{episode}', catchErrors(readEpisode));
  router.delete('/tv/{id}/season/{season}/episode/{episode}', requireAdmin, catchErrors(readEpisode));

  router.get('/genres', catchErrors(readGenre));
  router.post('/genres', requireAdmin, catchErrors(readGenre));

  router.get('/users', requireAdmin, catchErrors(listUsers));
  router.get('/users/:id', requireAdmin, catchErrors(listUser));
  router.patch('/users/:id', requireAdmin, catchErrors(updateUser));
  router.post('/users/register', requireAdmin, catchErrors(registerUser));
  router.get('/users/login', requireAuth, catchErrors(loginUser));
  router.get('/users/me', requireAuth, catchErrors(currentUser));
  router.patch('/users/me', requireAuth, catchErrors(updateCurrentUser));
*/




//minn user
//{"email": "fallegtblom@net.is","username": "blom", "password": "1234567890"}
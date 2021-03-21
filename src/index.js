import express from 'express';
import { catchErrors, setPagenumber, PAGE_SIZE } from './utils.js';
import { listSeries } from './tvQueries.js';

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

// async function changeSeries(req, res) {
//   const {
//     limit, offset, items, _links,
//   } = req.body;
//   let success = true;

//   const series = await getSerieById(id);
//   console.info(series);
//   if (!series) {
//     return res.status(404).json({ error: 'Series not found' });
//   }
//   return res.json( series );
// }


router.get('/', indexRoute);

// hér fyrir neðan eru allar skipanirnar fyrir allar síðurnar, held að best er að
// taka eina í einu og vinna þannig niður

router.get('/tv', catchErrors(getSeries));// series
//router.get('/genres', catchErrors(readSeasons));

//router.post('/tv', catchErrors(validationCheck)), catchErrors(changeSeries); //insertSeries

  // router.get('/tv/:id', catchErrors(getSerieById));//series
  // router.patch('/tv/:id', catchErrors(editSerieById));
  // router.delete('/tv/:id', catchErrors(deleteSerieById));

  // router.post('/tv/:id/rate', catchErrors(updateEpisodeRating));
  // router.patch('/tv/:id/rate', catchErrors(updateEpisodeRating));
  // router.delete('/tv/:id/rate', catchErrors(updateEpisodeRating));

  // router.post('/tv/:id/state', catchErrors(updateEpisodeStatus));
  // router.patch('/tv/:id/state', catchErrors(updateEpisodeStatus));
  // router.delete('/tv/:id/state', catchErrors(updateEpisodeStatus));

  // router.get('/tv/:id/season', catchErrors(readSeasons));
  // router.post('/tv/:id/season', catchErrors(readSeasons));

  // router.post('/tv/{id}/season/{season}/episode', catchErrors(readEpisodes));

  // router.get('/tv/{id}/season/{season}/episode/{episode}', catchErrors(readEpisode));
  // router.delete('/tv/{id}/season/{season}/episode/{episode}',  catchErrors(readEpisode));

  // router.get('/genres', catchErrors(readGenre));
  // router.post('/genres', catchErrors(readGenre));

  // router.get('/users', catchErrors(listUsers));
  // router.get('/users/:id', catchErrors(listUser));
  // router.patch('/users/:id', catchErrors(updateUser));
  // router.post('/users/register', catchErrors(registerUser));
  // router.get('/users/login', catchErrors(loginUser));
  // router.get('/users/me', catchErrors(currentUser));
  // router.patch('/users/me', catchErrors(updateCurrentUser));



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
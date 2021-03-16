import express from 'express';

export const router = express.Router();
import { catchErrors } from './utils.js';
import { readEpisodes, readSeasons, readSeries } from './csvReader.js';

async function indexRoute(req, res) {
    return res.json(
      {tv: {
        series: {
          href:'/tv','methods':['GET','POST']
        },
        serie: {
          href:'/tv/{id}','methods':['GET','PATCH','DELETE']
        },
        rate: {
          href:'/tv/{id}/rate','methods':['POST','PATCH','DELETE']
        },
        state: {
          href:'/tv/{id}/state','methods':['POST','PATCH','DELETE']}
        },
        seasons: {
          seasons:{
            href:'/tv/{id}/season','methods':['GET','POST']
          },
          season: {
            href:'/tv/{id}/season/{season}','methods':['GET','DELETE']
          }
        },
        episodes: {
          episodes: {
            href:'/tv/{id}/season/{season}/episode','methods':['POST']
          },
          episode: {
            href:'/tv/{id}/season/{season}/episode/{episode}','methods':['GET','DELETE']
          }
        },
        genres: {
          genres: {
            href:'/genres','methods':['GET','POST']
          }
        },
        users: {
          users: {
            href:'/users','methods':['GET']
          },
          user: {
            href:'/users/{id}','methods':['GET','PATCH']
          },
          register: {
            href:'/users/register','methods':['POST']
          },
          login: {
            href:'/users/login','methods':['POST']},
            me: {
              href:'/users/me','methods':['GET','PATCH']
            }
          }

      });
  }
  router.get('/', indexRoute);

//hér fyrir neðan eru allar skipanirnar fyrir allar síðurnar, held að best er að
// taka eina í einu og vinna þannig niður


 // router.get('/tv', catchErrors(getAllSeries()));//series
/*
  router.post('/tv', catchErrors(insertSeries)); //insertSeries

  router.get('/tv/:id', catchErrors(readSeries));//series
  router.patch('/tv/:id', catchErrors(updateSerie));
  router.delete('/tv/:id', catchErrors(updateSerie));

  router.post('/tv/:id/rate', catchErrors(rateSeries));
  router.patch('/tv/:id/rate', catchErrors(rateSeries));
  router.delete('/tv/:id/rate', catchErrors(rateSeries));

  router.post('/tv/:id/state', catchErrors(stateSeries));
  router.patch('/tv/:id/state', catchErrors(stateSeries));
  router.delete('/tv/:id/state', catchErrors(stateSeries));

  router.get('/tv/:id/season', catchErrors(readSeasons));
  router.post('/tv/:id/season', catchErrors(readSeasons));

  router.get('/tv/:id/season', catchErrors(readSeason));
  router.delete('/tv/:id/season', catchErrors(readSeason));

  router.post('/tv/{id}/season/{season}/episode', catchErrors(readEpisodes));

  router.get('/tv/{id}/season/{season}/episode/{episode}', catchErrors(readEpisode));
  router.delete('/tv/{id}/season/{season}/episode/{episode}',  catchErrors(readEpisode));


  router.get('/genres', catchErrors(readGenre));
  router.post('/genres', catchErrors(readGenre));


  router.get('/users', catchErrors(listUsers));
  router.get('/users/:id', catchErrors(listUser));
  router.patch('/users/:id', catchErrors(updateUser));
  router.post('/users/register', catchErrors(registerUser));
  router.get('/users/login', catchErrors(loginUser));
  router.get('/users/me', catchErrors(currentUser));
  router.patch('/users/me', catchErrors(updateCurrentUser));

*/



  //hér fyrir neðan er það með kalli á autherazation fyrir user og admin,
  //veit ekki hvort það var alltaf rétt að velja admin frekar en user ??

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
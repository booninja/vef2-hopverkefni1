import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {router as apiRouter} from './index.js';

import express from 'express';
import dotenv from 'dotenv';

const app = express();

app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));

app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

// app.use(express.static('src'));

app.use('/', apiRouter);
app.use('/', (req, res) => {
  res.render('index');
});

function notFoundHandler(req, res, next) {
  console.log('404', res);
  res.status(404).render('error', { title: 'Error', message: '404 Not Found' });
}

function errorHandler(error, req, res, next) {
  console.log('500', res);
  res.status(500).render('error', { title: 'Error', message: error });
}

app.use(notFoundHandler);

app.use(errorHandler);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/*
tv":{"series":
{"href":"/tv","methods":["GET","POST"]},"serie":{"href":"/tv/{id}","methods":["GET","PATCH","DELETE"]},
"rate":{"href":"/tv/{id}/rate","methods":["POST","PATCH","DELETE"]},
"state":{"href":"/tv/{id}/state","methods":["POST","PATCH","DELETE"]}},
"seasons":{"seasons":{"href":"/tv/{id}/season","methods":["GET","POST"]},
"season":{"href":"/tv/{id}/season/{season}","methods":["GET","DELETE"]}},
"episodes":{"episodes":{"href":"/tv/{id}/season/{season}/episode","methods":["POST"]},
"episode":{"href":"/tv/{id}/season/{season}/episode/{episode}","methods":["GET","DELETE"]}},
"genres":{"genres":{"href":"/genres","methods":["GET","POST"]}},
"users":{"users":{"href":"/users","methods":["GET"]},
"user":{"href":"/users/{id}","methods":["GET","PATCH"]},
"register":{"href":"/users/register","methods":["POST"]},
"login":{"href":"/users/login","methods":["POST"]},
"me":{"href":"/users/me","methods":["GET","PATCH"]}}}*/


//not user
  //getur séð öll gögn
  //getur skráð sig inn og orðið auðkenndur notandi
//user
  //change status
    //Langar að horfa
    //er að horfa
    //hef horft
  //rate episode int 0 - 5
//admin
  //breytt
  //bætt
  // eytt      tv show, seasons, episodes
  //admins can change users status

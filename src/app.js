import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { router as userRouter } from './users.js';

dotenv.config();

const {
  PORT: port = 3000,
  ACCESS_TOKEN_SECRET: sessionSecret,
} = process.env;

const app = express();


app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

//const path = dirname(fileURLToPath(import.meta.url));

// app.use(express.static(join(path, '../public')));
// 
// app.set('views', join(path, '../views'));
// app.set('view engine', 'ejs');

// app.use(express.static('src'));

// app.use('/', (req, res) => {
//   res.render('index');
// });


app.get('/', (req, res) => {
  res.json({'oskar':'ok'});
  console.log(userRouter);
});

app.use('/users', userRouter);

function notFoundHandler(req, res, next) {
  //console.log('404', res);
  res.status(404).json({'error': { title: 'Error', message: '404 Not Found' }});
}

function errorHandler(error, req, res, next) {
  //console.log('500', res);
  res.status(500).json({'error':{ title: 'Error', message: error }});
}

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = '127.0.0.1';
//const port = 3000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

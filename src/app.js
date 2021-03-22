import express from 'express';
import dotenv from 'dotenv';

import { router as apiRouter } from '../api/index.js';
import { router as tvRouter } from '../api/tv.js';
import passport, { router as userRouter } from './users.js';

dotenv.config();

const {
  PORT: port = 3000,
} = process.env;

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.use('/', apiRouter);
app.use('/tv', tvRouter);
app.use('/users', userRouter);

function notFoundHandler(req, res, next) { // eslint-disable-line
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  res.status(500).json({ error });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

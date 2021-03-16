import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { router as apiRouter } from './index.js';
import { router as userRouter } from './users.js';

dotenv.config();

const {
  PORT: port = 3000,
  ACCESS_TOKEN_SECRET: sessionSecret,
} = process.env;

const app = express();

app.use(express.json());

const data = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
];
app.use('/', apiRouter);

app.get('/:id', (req, res) => {
  const { id } = req.params;

  const item = data.find((i) => i.id === parseInt(id, 10));

  if (item) {
    return res.json(item);
  }

  return res.status(404).json({ error: 'Not found' });
});

app.use('/users', userRouter);

function notFoundHandler(req, res, next) { // eslint-disable-line
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(error, req, res, next) {
  res.status(500).json({ error });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

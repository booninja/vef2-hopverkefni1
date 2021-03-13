import express from 'express';
import dotenv from 'dotenv';

const app = express();

app.use(express.static('src'));
app.use('/', r);

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

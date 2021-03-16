
import express from 'express';

const app = express();

const data = [
  { id: 1, title: 'Item 1' },
  { id: 2, title: 'Item 2' },
];

app.get('/', (req, res) => {
  res.json(data);
});

app.get('/:id', (req, res) => {
  const { id } = req.params;

  const item = data.find(i => i.id === parseInt(id, 10));

  if (item) {
    return res.json(item);
  }

  return res.status(404).json({ error: 'Not found' });
});

function notFoundHandler(req, res, next) { // eslint-disable-line
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}
app.use(notFoundHandler);

const port = 3000;
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
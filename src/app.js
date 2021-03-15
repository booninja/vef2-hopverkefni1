import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));

app.set('views', join(path, '../views'));
app.set('view engine', 'ejs');

// app.use(express.static('src'));

/*app.use('/', (req, res) => {
  res.render('index');
});
*/

// ====================

const users = []; // tomt array til ad byrja med, thurfum ad bera saman vid gagnagrunn

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = { name: req.body.name, password: hashedPassword };
  
  // er notendanafnið laust?
  const user = users.find(user => user.name = req.body.name);
  if (user) {
    return res.status(400).send("Notendanafn þegar í notkun");
  }

  // stofnum notanda
  try {
    // her tharf ad vera sql skipun sem stofnar notanda
    users.push(newUser);
    res.status(201).send("Notandi " + newUser.name + " búinn til");
    // her kemur jwt token
  } catch {
    res.status(500).send("Eitthvað mistókst við nýskráningu");
  }
});

app.post('/login', async (req, res) => {
  // her tharf ad bera saman notenda vid gagnagrunn
  const user = users.find(user => user.name = req.body.name);
  if (user == null) {
    console.log(user);
    return res.status(400).send('Notandi fannst ekki');
  }
  try {
    const loginCheck = await bcrypt.compare(req.body.password, user.password);
    if (loginCheck) {
      res.status(200).send("Notandi skráður inn");
      // her kemur jwt token
    } else {
      res.status(500).send("Eitthvað mistókst við innskráningu");
    }
  } catch {
    res.status(500).send();
  }
});

app.post('/users', async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = { name: req.body.name, password: hashedPassword };
      console.log(hashedPassword);
      users.push(user);
      res.status(201).send()
  } catch {
      res.status(500).send()
  }
});

// ====================

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

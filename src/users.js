import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { validationResult } from 'express-validator';
import { Strategy, ExtractJwt } from 'passport-jwt';
import {
  findByUsername, findById, createUser, getAllUsers, findByEmail, comparePasswords, updateUser,
} from './userQueries.js';
import { loginValidation, registerValidation, profileValidation } from './userValidation.js';

export default passport;

dotenv.config();

const {
  ACCESS_TOKEN_SECRET: jwtSecret,
  ACCESS_TOKEN_LIFETIME: tokenLifetime = 9999999999999999,
} = process.env;

if (!jwtSecret) {
  console.error('Vantar ACCESS_TOKEN_SECRET í env');
  process.exit(1);
}

export const router = express.Router();
// router.use(express.json());

const users = getAllUsers();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

async function strat(data, next) {
  const user = await findById(data.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));
export function createJwtToken(id) {
  const payload = { id };
  const tokenOptions = { expiresIn: tokenLifetime };
  const token = jwt.sign(payload, jwtSecret, tokenOptions);
  return token;
}

export function requireAuthentication(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error = info.name === 'TokenExpiredError'
        ? 'expired token' : 'invalid token';
      return res.status(401).json({ error });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

export function requireAdminAuthentication(req, res, next) {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      const error = info.name === 'TokenExpiredError'
        ? 'expired token' : 'invalid token';
      return res.status(401).json({ error });
    }

    if (!user.admin) {
      return res.status(401).json({ error: 'Notandi er ekki með stjórnarréttindi' });
    }

    req.user = user;
    return next();
  })(req, res, next);
}

router.get('/', requireAdminAuthentication, async (req, res) => {
  if (await findByUsername('Teitur') === null) {
    await createUser({ name: 'Teitur', email: 'teg6@hi.is', password: 'cringe' });
  }
  res.json(users);
});

router.get('/:id(\\d+)', requireAdminAuthentication, async (req, res) => {
  const user = await findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'Notandi fannst ekki' });
  }
  try {
    return res.json(user);
  } catch {
    return res.status(500).json({ message: 'Eitthvað mistókst við að sækja notanda' });
  }
});

router.patch('/:id(\\d+)', requireAdminAuthentication, async (req, res) => {
  const user = await findById(req.params.id);
  const admin = user.admin ? 'f' : 't';
  try {
    await updateUser(user, null, null, admin);
    return res.status(201).json({ message: `Stjornarréttindi ${user.username} uppfærð í ${!user.admin}` });
  } catch {
    return res.status(500).json({ message: `Ekki tókst að upppfæra ${user.username} með stjórnarréttindi` });
  }
});

router.post('/register', registerValidation, async (req, res) => {
  const newUser = { username: req.body.name, email: req.body.email, password: req.body.password };
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.errors });
  }

  if (await findByUsername(newUser.username)) {
    return res.status(400).json({ message: 'Notendanafn þegar í notkun' });
  }

  if (await findByEmail(newUser.email)) {
    return res.status(400).json({ message: 'Netfang þegar í notkun' });
  }

  try {
    await createUser(newUser);
    return res.status(201).json({ message: `Notandi ${newUser.username} búinn til` });
  } catch {
    return res.status(500).json({ message: 'Eitthvað mistókst við nýskráningu' });
  }
});

router.post('/login', loginValidation, async (req, res) => {
  const user = await findByEmail(req.body.email);
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.errors });
  }

  if (!user) {
    return res.status(400).json({ message: 'Notandi fannst ekki' });
  }
  try {
    const loginCheck = await comparePasswords(req.body.password, user.password);
    if (loginCheck) {
      const token = createJwtToken(user.id);
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          admin: user.admin,
        },
        token,
        expiresIn: Number(tokenLifetime),
      });
    }
    return res.status(500).json({ message: 'Rangt lykilorð' });
  } catch {
    return res.status(500).json({ message: 'Eitthvað mistókst við innskráningu' });
  }
});

router.get('/me', requireAuthentication, async (req, res) => {
  res.json(req.user);
});

router.patch('/me', requireAuthentication, profileValidation, async (req, res) => {
  const email = !req.body.email ? req.user.email : req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const password = !req.body.password ? req.user.password : hashedPassword;

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.errors });
  }

  try {
    await updateUser(req.user, email, password, req.user.admin);
    return res.status(201).json({ message: `${req.user.username} uppfærður` });
  } catch (e) {
    return res.status(500).json({ message: `Ekki tókst að upppfæra ${req.user.username}: ${e}` });
  }
});

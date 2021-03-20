/* 
users.js
Föll tengd notendaumsjón fara hingað t.d. login, register, o.s.frv.
*/

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { findByUsername, findById, createUser, getAllUsers, findByEmail, comparePasswords, updateUser } from './userQueries.js';

export default passport;

dotenv.config();

const {
    ACCESS_TOKEN_SECRET: jwtSecret,
    ACCESS_TOKEN_LIFETIME: tokenLifetime = "30m"
} = process.env;

if (!jwtSecret) {
    console.error('Vantar ACCESS_TOKEN_SECRET í env');
    process.exit(1);
}

export const router = express.Router();
//router.use(express.json());

const users = await getAllUsers();

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
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
    },
  )(req, res, next);
}
  
// tharf ad utfaera
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
        },
    )(req, res, next);
}

router.get('/', requireAdminAuthentication, async (req, res) => {
    if (await findByUsername("Teitur") === null) {
        await createUser({name: "Teitur", email: "teg6@hi.is", password: "cringe"});
    }
    res.json(users);
});

router.get('/:id(\\d+)', requireAdminAuthentication, async (req, res) => {
    const user = await findById(req.params.id);
    if (!user) {
        return res.status(404).json({message: "Notandi fannst ekki"});
    }
    try {
        res.json(user);
    } catch {
        res.status(500).json({message: "Eitthvað mistókst við að sækja notanda"});
    }
});

// tharf ad utfaera
router.patch('/:id(\\d+)', requireAdminAuthentication, async (req, res) => {
    const user = await findById(req.params.id);
    const admin = user.admin ? 'f' : 't';
    try {
        await updateUser(user, null, null, admin);
        return res.status(201).json({message: `Stjornarréttindi ${user.username} uppfærð í ${!user.admin}`});
    } catch {
        return res.status(500).json({message: `Ekki tókst að upppfæra ${user.username} með stjórnarréttindi`});
    }
});

router.post('/register', async (req, res) => {
    const newUser = { name: req.body.name, email: req.body.email, password: req.body.password};
    
    if (await findByUsername(newUser.name)) {
        return res.status(400).json({message: "Notendanafn þegar í notkun"});
    } 
    
    else if (await findByEmail(newUser.email)) {
        return res.status(400).json({message: "Netfang þegar í notkun"});
    }

    try {
        await createUser(newUser);
        return res.status(201).json({message: "Notandi " + newUser.name + " búinn til"});
    } catch {
        return res.status(500).json({message: "Eitthvað mistókst við nýskráningu"});
    }
});

router.post('/login', async (req, res) => {
    const user = await findByUsername(req.body.name);
    if (!user) {
        return res.status(400).json({message:'Notandi fannst ekki'});
    }
    try {
        const loginCheck = await comparePasswords(req.body.password, user.password);
        if (loginCheck) {
            // her kemur jwt token
            const token = createJwtToken(user.id);
            return res.json({ 
                "user": {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                    admin: user.admin
                },
                token,
                expiresIn: Number(tokenLifetime)
            });
        } else {
            return res.status(500).json({message: "Rangt lykilorð"});
        }
    } catch {
        return res.status(500).json({message:"Eitthvað mistókst við innskráningu"});
    }
});

router.get('/me', requireAuthentication, async (req, res) => {
    res.json(req.user);
});
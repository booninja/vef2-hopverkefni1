/* 
users.js
Föll tengd notendaumsjón fara hingað t.d. login, register, o.s.frv.
*/

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import { findByUsername, findById, createUser, getAllUsers, findByEmail, comparePasswords } from './userQueries.js';

dotenv.config();

const {
    ACCESS_TOKEN_SECRET: jwtSecret,
    ACCESS_TOKEN_LIFETIME: tokenLifetime = 20
} = process.env;

export const router = express.Router();
//router.use(express.json());

const users = await getAllUsers();

router.get('/', async (req, res) => {
    if (await !findByUsername("Teitur")) {
        await createUser({name: "Teitur", email: "teg6@hi.is", password: "cringe"});
    }
    res.json(users);
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
        // ~~ her tharf ad vera sql skipun sem stofnar notanda ~~
        //users.push(newUser);
        await createUser(newUser);
        res.status(201).json({message: "Notandi " + newUser.name + " búinn til"});

        // ~~ her aetti ad koma jwt token ~~
        //const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
        //res.json({ accessToken: accessToken });
        
    } catch {
        res.status(500).json({message: "Eitthvað mistókst við nýskráningu"});
    }
});

router.post('/login', async (req, res) => {
    // her tharf ad bera saman notenda vid gagnagrunn
    const user = await findByUsername(req.body.name);
    if (!user) {
        return res.status(400).json({message:'Notandi fannst ekki'});
    }
    try {
        console.log(`login: password: ${req.body.password}`);
        console.log(`login: user.password: ${user.password}`);
        const loginCheck = await comparePasswords(req.body.password, user.password);
        if (loginCheck) {
            res.status(200).json({message:"Notandi skráður inn"});

            // her kemur jwt token
            //const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
            //return res.status(200).json({ accessToken: accessToken });
        } else {
            return res.status(500).json({message: "Rangt lykilorð"});
        }
    } catch {
        return res.status(500).json({message:"Eitthvað mistókst við innskráningu"});
    }
});
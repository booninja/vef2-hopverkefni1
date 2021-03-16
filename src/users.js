/* 
users.js
Föll tengd notendaumsjón fara hingað t.d. login, register, o.s.frv.
*/

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import { query } from './setup.js';

dotenv.config();

const {
    ACCESS_TOKEN_SECRET: jwtSecret,
    ACCESS_TOKEN_LIFETIME: tokenLifetime = 20
} = process.env;

export const router = express.Router();
//router.use(express.json());

const users = []; // tomt array til ad byrja med, thurfum ad bera saman vid gagnagrunn

// er notendanafn til?
function checkUsername(username) {
    const checkUsername = users.find(user => user.name = req.body.name);
    if (checkUsername) {
        return false;
    }
    return true;
}

// er netfang til?
function checkEmail(email) {
    const checkEmail = users.find(user => user.email = req.body.email);
    if (checkEmail) {
        return false;
    }
    return true;
}

// athugar ef rett lykilorð var slegið inn
async function comparePasswords(password, user) {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
        return user;
    }
    return false;
}

// bua til notanda i gagnagrunn
//async function createUser(user) {
//    //const newUser = await query('INSERT INTO Users (name, email, password) VALUES ($1, $2, $3)');
//}

router.get('/', (req, res) => {
  res.json(users);
});

router.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = { name: req.body.name, email: req.body.email, password: hashedPassword };
  
  if (!checkUsername(newUser.name)) {
    return res.status(400).json({message: "Notendanafn þegar í notkun"});
  } 
  
  else if (!checkEmail(newUser.email)) {
      return res.status(400).json({message: "Netfang þegar í notkun"});
  }

  try {
    // ~~ her tharf ad vera sql skipun sem stofnar notanda ~~
    users.push(newUser);
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
    const user = users.find(user => user.name = req.body.name);
    if (user == null) {
        console.log(user);
        return res.status(400).json({message:'Notandi fannst ekki'});
    }
    try {
        const loginCheck = await bcrypt.compare(req.body.password, user.password);
        if (loginCheck) {
            res.status(200).json({message:"Notandi skráður inn"});
            // her kemur jwt token
            //const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET);
            //return res.status(200).json({ accessToken: accessToken });
        } else {
            return res.status(500).json({message: "Eitthvað mistókst við innskráningu"});
        }
    } catch {
        return res.status(500).json({message:"Eitthvað mistókst við innskráningu"});
    }
});
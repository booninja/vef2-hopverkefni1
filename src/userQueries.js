import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { check } from 'express-validator';

dotenv.config();

const {
  DATABASE_URL: connectionString,
  NODE_ENV: nodeEnv = 'development',
} = process.env;

// Notum SSL tengingu við gagnagrunn ef við erum *ekki* í development mode, þ.e.a.s. á local vél
const ssl = nodeEnv !== 'development' ? { rejectUnauthorized: false } : false;

const pool = new pg.Pool({ connectionString, ssl });

pool.on('error', (err) => {
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
});

export async function query(_query, values = []) {
  const client = await pool.connect();

  try {
    const result = await client.query(_query, values);
    return result;
  } finally {
    client.release();
  }
}

// athugar ef rett lykilorð var slegið inn
export async function comparePasswords(password, dbPassword) {
  console.log(`comparePasswords: password: ${password}`);
  console.log(`comparePasswords: dbPassword: ${dbPassword}`);
  const checkPassword = await bcrypt.compare(password, dbPassword);
  console.log(`checkPassword: ${checkPassword}`);
  if (checkPassword) {
    return true;
  }
  return false;
}

export async function createAdmin(user) {
  const q = 'INSERT INTO Users (username, email, password, admin) VALUES ($1, $2, $3, TRUE)';
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await query(q, [user.name, user.email, hashedPassword]);
    return result.rows[0];
  } catch (e) {
    console.log(`Gat ekki buid til notanda: ${e}`);
  }
  return null;
}

export async function updateUser(user, email, password, admin) {
  console.log(user, email, password, admin)
  const q = `UPDATE users SET email=$1, password=$2, admin=$3 WHERE id='${user.id}'`;
  console.log(q);
  if (!email) {      
      email = user.email;
  }
  if (!password) {
      password = user.password;
  }
  if (!admin) {
    admin = user.admin;
  }
  try {
    const result = await query(q, [email, password, admin]);
    console.log(`result: ${result}`)
    return result.rows[0];
  } catch (e) {
    console.log(`Gat ekki uppfært notanda: ${e}`);
  }
  return null;
 }

export async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const q = 'INSERT INTO Users (username, email, password, admin) VALUES ($1, $2, $3, FALSE)';
  try {
    const result = await query(q, [user.name, user.email, hashedPassword]);
    return result.rows[0];
  } catch (e) {
    console.log(`Gat ekki buid til notanda: ${e}`);
  }
  return null;
}

export async function getAllUsers() {
  const q = 'SELECT * FROM Users';
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.log(`Gat ekki sott notendur: ${e}`);
  }
  return null;
}

export async function findByEmail(email) {
  const q = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await query(q, [email]);
    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir email');
  }
  return null;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';
  try {
    const result = await query(q, [id]);
    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }
  return null;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await query(q, [username]);
    if (result.rowCount === 1) {
      console.log(result.rows[0]);
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }
  return false;
}

import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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
  const checkPassword = await bcrypt.compare(password, dbPassword);
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
    console.error(`Gat ekki buid til notanda: ${e}`); // eslint disable-line
  }
  return null;
}

export async function updateUser(user, email, password, admin) {
  const q = `UPDATE users SET email=$1, password=$2, admin=$3 WHERE id='${user.id}'`;
  try {
    const result = await query(q, [
      !email ? user.email : email,
      !password ? user.password : password,
      !admin ? user.admin : admin,
    ]);
    return result.rows[0];
  } catch (e) {
    console.error(`Gat ekki uppfært notanda: ${e}`); // eslint disable-line
  }
  return null;
}

export async function createUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const q = 'INSERT INTO Users (username, email, password, admin) VALUES ($1, $2, $3, FALSE)';
  try {
    await query(q, [user.name, user.email, hashedPassword]);
  } catch (e) {
    console.error(`Gat ekki buid til notanda: ${e}`); // eslint disable-line
  }
  return null;
}

export async function getAllUsers() {
  const q = 'SELECT * FROM Users';
  try {
    const result = await query(q);
    return result.rows;
  } catch (e) {
    console.error(`Gat ekki sott notendur: ${e}`); // eslint disable-line
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
    console.error('Gat ekki fundið notanda eftir email'); // eslint disable-line
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
    console.error('Gat ekki fundið notanda eftir id'); // eslint disable-line
  }
  return null;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await query(q, [username]);
    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni'); // eslint disable-line
    return null;
  }
  return false;
}

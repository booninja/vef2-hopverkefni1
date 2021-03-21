CREATE TABLE IF NOT EXISTS series(
  id serial PRIMARY KEY,
  name varchar(255) not null,
  airDate date,
  inProduction boolean,
  tagline varchar(255),
  poster varchar(255) not null,
  description text not null,
  language varchar(255) not NULL,
  network varchar(255) not null,
  website varchar(255)
);

CREATE TABLE IF NOT EXISTS categories(
  id serial PRIMARY KEY,
  name varchar(255) UNIQUE not null
);

CREATE TABLE IF NOT EXISTS seriesToCategories(
  id serial PRIMARY KEY,
  serieID integer REFERENCES series (id)  ON DELETE CASCADE,
  categoryID integer REFERENCES categories (id)  ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seasons(
  id serial PRIMARY KEY,
  name varchar(255) not NULL,
  number integer CHECK (number > 0) NOT NULL,
  airDate date,
  description text,
  poster varchar(255) not null,
  serieID integer REFERENCES series (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS episodes(
  id serial PRIMARY KEY,
  name varchar(255) not null,
  number integer CHECK (number > 0),
  airDate date,
  description text,
  season varchar(255) not null,
  seasonNumber integer ,
  serieID integer REFERENCES series (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users(
  id serial primary key,
  email varchar(255) not null,
  username varchar(255) NOT NULL unique,
  password varchar(255) NOT NULL,
  admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS SerieToUser(
  id serial primary key,
  serieID integer REFERENCES series(id) ON DELETE CASCADE,
  userID integer REFERENCES Users(id) ON DELETE CASCADE,
  status varchar(255),
  grade integer CHECK (grade >= 0 and grade <= 5)
);
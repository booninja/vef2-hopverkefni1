CREATE TABLE IF NOT EXISTS serie(
  id serial PRIMARY KEY,
  name varchar(64) not null,
  airDate date,
  inProduction boolean,
  tagline varchar(64),
  poster varchar(128) not null, 
  description text not null,
  language varchar(64) not NULL,
  network varchar(64) not null,
  website varchar(64)
);

CREATE TABLE IF NOT EXISTS categories(
  category varchar(64) UNIQUE not null,
  id serial PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS showToCategories(
  id serial PRIMARY KEY,
  serieID serial REFERENCES serie (id),
  categoryID serial REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS seasons(
  id serial PRIMARY KEY,
  serieID serial REFERENCES serie (id),
  name varchar(64) not NULL,
  number integer CHECK (number > 0),
  airDate date,
  description text not null,
  poster varchar(128) not null
);

CREATE TABLE IF NOT EXISTS episodes(
  id serial PRIMARY KEY,
  seasonsID serial REFERENCES seasons (id),
  name varchar(64) not null,
  number integer CHECK (number > 0), 
  airDate date,
  description text not null
);

CREATE TABLE IF NOT EXISTS users(
  id serial primary key,
  email varchar(64) not null,
  username varchar(64) NOT NULL unique,
  password varchar(64) NOT NULL,
  admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS EpisodeToUser(
  episodeID serial REFERENCES Episodes(id),
  userID serial REFERENCES Users(id),
  status varchar(128),
  grade integer NOT NULL CHECK (grade >= 0 and grade <= 5)
);

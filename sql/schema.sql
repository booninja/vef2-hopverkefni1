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

CREATE TABLE IF NOT EXISTS showToCategories(
  id serial PRIMARY KEY,
  seriesID integer REFERENCES series (id),
  categoryID integer REFERENCES categories (id)
);

CREATE TABLE IF NOT EXISTS seasons(
  id serial PRIMARY KEY,
  name varchar(255) not NULL,
  number integer CHECK (number > 0),
  airDate date,
  description text,
  poster varchar(255) not null,
  seriesID integer REFERENCES series (id)
);

CREATE TABLE IF NOT EXISTS episodes(
  id serial PRIMARY KEY,
  name varchar(255) not null,
  number integer CHECK (number > 0), 
  airDate date,
  description text,
  seasonsID integer REFERENCES seasons (id)
);

CREATE TABLE IF NOT EXISTS users(
  id serial primary key,
  email varchar(255) not null,
  username varchar(255) NOT NULL unique,
  password varchar(255) NOT NULL,
  admin boolean DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS EpisodeToUser(
  id serial primary key,
  episodeID integer REFERENCES Episodes(id),
  userID integer REFERENCES Users(id),
  status varchar(255),
  grade integer NOT NULL CHECK (grade >= 0 and grade <= 5)
);

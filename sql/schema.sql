CREATE TABLE IF NOT EXISTS series(
  id serial primary key,
  category varchar(64) not null,
  name varchar(64) not null,
  televised timestamp with time zone,
  inProduction boolean,
  poster varchar(64) not null, 
  description text not null,
  language varchar(64) not NULL,
  network varchar(64),
  website varchar(64),
  foreign key (category) REFERENCES categories (category)
);

CREATE TABLE IF NOT EXISTS categories(
  category varchar(64) primary key
);

CREATE TABLE IF NOT EXISTS seasons(
  name varchar(64) not NULL,
  number int,
  televised timestamp with time zone,
  description text not null,
  poster varchar(64) not null, 
  foreign key (id) references episodes(id)
);

CREATE TABLE IF NOT EXISTS episodes(
  name varchar(64) not null,
  number int not null check (number > 0)
  televised timestamp with time zone,
  description text not null,
  
)
CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username character varying(255) NOT NULL unique,
  password character varying(255) NOT NULL
);


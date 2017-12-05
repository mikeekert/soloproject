# QuestLog

QuestLog is an application built to insert and track a Users' collection of video games, including progress and completion of any title in the application. 

The application allows for a user to create their own account, add/edit/delete games from their collection, and add/modify time spent with any particular game. Third party API information is used to help search for games when adding to the collection as well as pulling in a community estimated time to complete (in number of hours) for each game.

Visual themes were inspired from the Nintendo/8-Bit era of gaming, heavily using pixel based menus, fonts, and assets.

See Demo: http://questlog.mikeekert.com/#/home

## Built With

- postgreSQL
- Express.js
- AngularJS
- node.js
- CSS3 coding all custom, without any additional frameworks or libraries.
- API integration from igbd.com and howlongtobeat.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- Creation of an account within IGDB.com api (https://api.igdb.com/)

### Installing

Steps to get the development environment running;

Create postgreSQL table in local db:

```sql
CREATE TABLE user_game (
    usergame_id integer NOT NULL,
    user_id integer,
    progress integer,
    completed boolean DEFAULT false,
    nowplaying boolean DEFAULT false,
    timetobeat integer DEFAULT 15,
    title character varying(200),
    platform character varying(200),
    releasedate character varying(200),
    coverart character varying(300)
);

CREATE TABLE users (
    id integer NOT NULL,
    username citext NOT NULL,
    password character varying(240) NOT NULL,
    CONSTRAINT lowercase CHECK (((username)::text = lower((username)::text)))
);

ALTER TABLE ONLY user_game
    ADD CONSTRAINT user_game_pkey PRIMARY KEY (usergame_id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY users
    ADD CONSTRAINT users_username_key UNIQUE (username);

ALTER TABLE ONLY user_game
    ADD CONSTRAINT user_game_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

Run ``` npm install ``` to grab project dependancies.

### Completed Features

- [x] User Register
- [x] User add/remove games from collection
- [x] Search functionality
- [x] Display of database for each user

### Next Steps

Features that you would like to add at some point in the future.

- [ ] Re-work inside Angular 4



## Authors

* Michael Ekert


## Acknowledgments

* Prime Digital Academy

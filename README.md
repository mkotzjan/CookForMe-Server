# CookForMe-Server
## Description
Server for the [CookForMe](https://www.github.com/mkotzjan/CookForMe) App

## Installation

Clone this repository.

Use `npm install` to install all dependencies.
You also need to have MYSQL installed.

Execute `npm setup.js` to generate your own local .env file.
Now modify the local environment variables to suit your needs.

Knex.js must be installed globaly for using the migrations.
Just type `npm install knex -g` and afterwards create the database tables with
`knex migrate:latest`. You may want to fill the database with sample data: `knex
seed:run`.

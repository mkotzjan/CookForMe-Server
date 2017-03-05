"use strict";

// Load local environment data
var dotenv = require('dotenv');
dotenv.load();

var knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
      charset  : process.env.DB_CHARSET,
    }
});

var bookshelf = require('bookshelf')(knex);

module.exports = {
  bookshelf: bookshelf
}

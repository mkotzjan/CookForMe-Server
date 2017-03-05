"use strict";

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// use body parser to get info from post and/or URL parameter
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('CookForMe api');
})

// REGISTER
app.post('/register', (request, response) => {
  response.send('User ' + request.body.username + ' created');
})

// LOGIN
app.post('/login', (request, response) => {
  response.json({
    success: true,
    message: 'Login sucessful',
    token: 'example'
  });
})

// ADD FOOD
app.post('/addFood', (request, response) => {
  response.send('Food added');
})

// EDIT FOOD
app.post('/food/:id/edit', (request, response) => {
  response.send('Food ' + request.params.id + ' edited');
})

// DELETE FOOD
app.get('/food/:id/delete', (request, response) => {
  response.send('Food ' + request.params.id + ' deleted');
})

// SIGN IN
app.get('/food/:id/signIn', (request, response) => {
  response.send('Signed in to' + request.params.id);
})

// SIGN OUT
app.get('/food/:id/signOut', (request, response) => {
  response.send('Signed out of ' + request.params.id);
})

// SUBSCRIBER
app.get('/food/:id/subscriber', (request, response) => {
  response.json({});
})

// USER
app.get('/user', (request, response) => {
  response.json({
    1: 'test',
    2: 'test2'
  });
})

app.get('/user/:id', (request, response) => {
  response.json({});
})

// FOOD
app.get('/food', (request, response) => {
  response.json({});
})

app.get('/food/:id', (request, response) => {
  response.json({});
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on', port);
})

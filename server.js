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

// ADD MEAL
app.post('/addMeal', (request, response) => {
  response.send('Meal added');
})

// EDIT MEAL
app.post('/meal/:id/edit', (request, response) => {
  response.send('Meal ' + request.params.id + ' edited');
})

// DELETE MEAL
app.get('/meal/:id/delete', (request, response) => {
  response.send('Meal ' + request.params.id + ' deleted');
})

// SUBSCRIBE TO MEAL
app.get('/meal/:id/subscribe', (request, response) => {
  response.send('Subscribed to' + request.params.id);
})

// UNSUBSCRIBE FROM MEAL
app.get('/meal/:id/unsubscribe', (request, response) => {
  response.send('Unsubscribed from ' + request.params.id);
})

// SUBSCRIBER
app.get('/meal/:id/subscriber', (request, response) => {
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

// MEAL
app.get('/meal', (request, response) => {
  response.json({});
})

app.get('/meal/:id', (request, response) => {
  response.json({});
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on', port);
})

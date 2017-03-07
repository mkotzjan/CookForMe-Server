"use strict";

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const model = require('./models_collections/models');
const collection = require('./models_collections/collections');

// use body parser to get info from post and/or URL parameter
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var apiRoutes = express.Router();

apiRoutes.get('/', (request, response) => {
  response.send('CookForMe api');
})

// REGISTER
apiRoutes.post('/register', (request, response) => {
  model.User.forge({
    username: request.body.username,
    password: bcrypt.hashSync(request.body.password)
  })
  .save().then(function (user) {
    response.json({error: false, data: {id: user.get('id')}});
  })
  .catch(function (err) {
    response.status(500).json({error: true, data: {message: err.message}});
  });
})

// LOGIN
apiRoutes.post('/login', (request, response) => {
  response.json({
    success: true,
    message: 'Login sucessful',
    token: 'example'
  });
})

// ADD MEAL
apiRoutes.post('/addMeal', (request, response) => {
  response.send('Meal added');
})

// EDIT MEAL
apiRoutes.post('/meal/:id/edit', (request, response) => {
  response.send('Meal ' + request.params.id + ' edited');
})

// DELETE MEAL
apiRoutes.get('/meal/:id/delete', (request, response) => {
  response.send('Meal ' + request.params.id + ' deleted');
})

// SUBSCRIBE TO MEAL
apiRoutes.get('/meal/:id/subscribe', (request, response) => {
  response.send('Subscribed to' + request.params.id);
})

// UNSUBSCRIBE FROM MEAL
apiRoutes.get('/meal/:id/unsubscribe', (request, response) => {
  response.send('Unsubscribed from ' + request.params.id);
})

// SUBSCRIBER
apiRoutes.get('/meal/:id/subscriber', (request, response) => {
  response.json({});
})

// USER

var userInfo = ['id', 'username', 'created_at'];

apiRoutes.get('/user', (request, response) => {
  collection.Users.forge().fetch({columns: userInfo})
  .then(function (col) {
    response.json({error: false, data: col.toJSON()});
  })
  .catch(function (err) {
    response.status(500).json({error: true, data: {message: err.message}});
  });
})

apiRoutes.get('/user/:id', (request, response) => {
  model.User.forge({id: request.params.id}).fetch({columns: userInfo})
  .then(function (user) {
    if (!user) {
      response.status(404).json({error: true, data: {}});
    } else {
      response.json({error: false, data: user.toJSON()});
  }})
  .catch(function (err) {
    response.status(500).json({error: true, data: {message: err.message}});
  });
})

// MEAL
apiRoutes.get('/meal', (request, response) => {
  collection.Meal.forge().fetch()
  .then(function (col) {
    response.json({error: false, data: col.toJSON()});
  })
  .catch(function (err) {
    response.status(500).json({error: true, data: {message: err.message}});
  });
})

apiRoutes.get('/meal/:id', (request, response) => {
  model.Meal.forge({id: request.params.id}).fetch()
  .then(function (meal) {
    if (!meal) {
      response.status(404).json({error: true, data: {}});
    } else {
      response.json({error: false, data: meal.toJSON()});
  }})
  .catch(function (err) {
    response.status(500).json({error: true, data: {message: err.message}});
  });
})

// Apply apiRoutes to app
app.use('/', apiRoutes);

// Start to listen
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log('server is listening on', port);
})

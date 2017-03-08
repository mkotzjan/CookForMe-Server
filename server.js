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

// Error functions
function IllegalAccessException(message) {
  this.message = message;
  this.name = "DivisionException";
}

function IllegalOperationException(message) {
  this.message = message;
  this.name = "DivisionException";
}

// --- Routes ---
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
  // TODO
  response.json({
    success: true,
    message: 'Login sucessful',
    token: 'example'
  });
})

// ADD MEAL
apiRoutes.post('/addMeal', (request, response) => {
  model.Meal.forge({
    // Use userID from athenticate middleware
    user:                request.get('userID'),
    title:               request.body.title,
    description:         request.body.description,
    amount:              request.body.amount,
    meeting_place:       request.body.meeting_place,
    // TODO: It's possible that this doesn't work because of datetime
    // conversions
    meeting_date:        request.body.meeting_date,
    subscriptions_until: request.body.subscriptions_until
  })
  .save()
  .then(function (meal) {
    response.json({error: false, data: {id: meal.get('id')}});
  })
  .catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// GET MEAL
apiRoutes.get('/meal', (request, response) => {
  collection.Meals.forge().fetch()
  .then(function (col) {
    response.json({error: false, data: col.toJSON()});
  })
  .catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

apiRoutes.get('/meal/:id', (request, response) => {
  model.Meal.forge({id: request.params.id}).fetch()
  .then(function (meal) {
    response.json({error: false, data: meal.toJSON()});
  })
  .catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// EDIT MEAL
apiRoutes.post('/meal/:id/edit', (request, response) => {
  model.Meal.forge({id: request.params.id})
  .fetch({require: true}).then(function (meal) {
    // Check if user is permitted: User has to be the one who added the meal
    if (meal.get('user') !== parseInt(request.get('userID'))) {
      throw new IllegalAccessException("User is not permitted to alter the meal.");
    }
    
    // Save the new data
    meal.save({
        title:                request.body.title || meal.get('title'),
        description:          request.body.description || meal.get('description'),
        amount:               request.body.amount || meal.get('amount'),
        meeting_place:        request.body.meeting_place || meal.get('meeting_place'),
        meeting_date:         request.body.meeting_date || meal.get('meeting_date'),
        subscriptions_until:  request.body.subscriptions_until || meal.get('subscriptions_until')
    }).then(function () {
      response.json({error: false, data: {id: meal.get('id')}});
    });
  }).catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// DELETE MEAL
apiRoutes.get('/meal/:id/delete', (request, response) => {
  model.Meal.forge({id: request.params.id})
  .fetch({require: true}).then(function (meal) {
    meal.destroy().then(function () {
      response.json({error: false, data: {}});
    }).catch(function (error) {
      response.status(500).json({error: true, data: {message: error.message}});
    })
  }).catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// SUBSCRIBE TO MEAL
apiRoutes.get('/meal/:id/subscribe', (request, response) => {
  model.Meal.forge({id: request.params.id})
  .fetch({withRelated: ['subscriptions'], require: true})
  .then(function (meal) {
    if (meal) {
      var subscriptions = meal.related('subscriptions');
      // if (subscriptions)
    }
  })
  model.MealSubscription.forge({
      meal: request.params.id,
      user: request.get('userID')
  }).save()
  .then(function () {
    response.json({error: false, data: {}});
  }).catch(function (error) {
  response.status(500).json({error: true, data: {message: error.message}});
  });
})

// UNSUBSCRIBE FROM MEAL
apiRoutes.get('/meal/:id/unsubscribe', (request, response) => {
  model.MealSubscription.forge({
      meal: request.params.id,
      user: request.get('userID')
  }).fetch({require: true})
  .then(function (mealSubscription) {
    mealSubscription.destroy().then(function () {
      response.json({error: false, data: {}});
    }).catch(function (error) {
      response.status(500).json({error: true, data: {message: error.message}});
    });
  }).catch(function (error) {
  response.status(500).json({error: true, data: {message: error.message}});
  });
})

// SUBSCRIBER
apiRoutes.get('/meal/:id/subscriber', (request, response) => {
  //collection.MealSubscriptions.forge({meal: request.params.id})
  collection.Users.query(function (qb) {
    qb.select('user.id', 'user.username').from('user')
    .leftJoin('meal_subscription', 'user.id', 'meal_subscription.user').where('meal', request.params.id);
  })
  .fetch({require: true})
  .then(function (col) {
    response.json({error: false, data: col.toJSON()});
  })
  .catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
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

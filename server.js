"use strict";

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('./models_collections/models');
const collection = require('./models_collections/collections');

const dotenv = require('dotenv');
dotenv.load();

// use body parser to get info from post and/or URL parameter
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Error functions
function AuthenticationException(message) {
  this.message = message;
  this.name = "DivisionException";
}

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
  bcrypt.hash(request.body.password, process.env.BCRYPT_SALTROUNDS, function(error, hash) {
    if(error) {
      return response.status(500).json({error: true, data: error});
    }
    model.User.forge({
      username: request.body.username,
      password: hash
    })
    .save().then(function (user) {
      response.json({error: false, data: {id: user.get('id')}});
    })
    .catch(function (error) {
      response.status(500).json({error: true, data: {message: error.message}});
    });
  })
})

// LOGIN
apiRoutes.post('/login', (request, response) => {
  model.User.forge({username: request.body.username})
  .fetch().then(function (user) {
    if(!user) {
      throw new AuthenticationException("Authentication failed: user");
    }
    bcrypt.compare(request.body.password, user.get('password'), function(error, result) {
      if(error) {
        return response.status(500).json({error: true, data: {message: error}});
      } else if (!result) {
        return response.status(500).json({error: true, data: {message: "Authentication failed: result"}});
      }
      var token = jwt.sign({id: user.get('id')}, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });
      response.json({error: false, token: token});
    });
  }).catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// MIDDLEWARE TO VERIFY TOKEN
apiRoutes.use(function(request, response, next) {
  // Get token from request
  var token = request.body.token || request.get('token');

  // decode
  if (token) {
    // verify
    jwt.verify(token, process.env.JWT_SECRET, function(error, decoded) {
      if (error) {
        return response.status(498).json({error: true, data: {message: 'Token verification failed.'}});
      } else {
        // Success
        request.userID = decoded.id;
        next();
      }
    });
  } else {
    return response.status(403).json({error: true, data: {message: 'No token provided.'}});
  }
});

// ADD MEAL
apiRoutes.post('/addMeal', (request, response) => {
  model.Meal.forge({
    // Use userID from athenticate middleware
    user:                request.userID,
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
  model.Meal.forge({id: request.params.id}).fetch({require: true})
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
    if (meal.get('user') !== parseInt(request.userID)) {
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
    if (meal.get('user') !== parseInt(request.userID)) {
      throw new IllegalAccessException("User is not permitted to delete the meal.");
    }

    // Delete meal
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
  var id = request.params.id;

  collection.MealSubscriptions.query(function (qb) {
    qb.select().from('meal_subscription').where('meal', id);
  }).fetch({require: true}).then(function (col) {
    model.Meal.forge({id: id}).fetch({require: true})
    .then(function (meal) {
      // TODO: The date needs to be checked as well
      var now = new Date();
      var subscriptions_until = new Date(meal.get('subscriptions_until'));
      // Check if amount allows any more subscriber
      if (col.size() >= meal.get('amount')) {
        throw new IllegalOperationException("Reached max amount of subscribers");
      } else if (now.getTime() > subscriptions_until.getTime()) { // Check Date
        throw new IllegalOperationException("No more subscriptions allowed");
      }

      // Create subscription
      model.MealSubscription.forge({
          meal: request.params.id,
          user: request.get('userID')
      }).save()
      .then(function () {
        response.json({error: false, data: {}});
      }).catch(function (error) {
        response.status(500).json({error: true, data: {message: error.message}});
      });
    }).catch(function (error) {
      response.status(500).json({error: true, data: {message: error.message}});
    });
  }).catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });
})

// UNSUBSCRIBE FROM MEAL
apiRoutes.get('/meal/:id/unsubscribe', (request, response) => {
  var id = request.params.id;

  model.Meal.forge({id: id}).fetch({require: true})
  .then(function (meal) {
    var now = new Date();
    var subscriptions_until = new Date(meal.get('subscriptions_until'));
    // Check for date
    if (now.getTime() > subscriptions_until.getTime()) {
      throw new IllegalOperationException("It's to late to unsubscribe.");
    }

    // delete subscription
    model.MealSubscription.forge({
        meal: id,
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
  }).catch(function (error) {
    response.status(500).json({error: true, data: {message: error.message}});
  });  
})

// SUBSCRIBER
apiRoutes.get('/meal/:id/subscriber', (request, response) => {
  collection.Users.query(function (qb) {
    qb.select('user.id', 'user.username').from('user')
    .leftJoin('meal_subscription', 'user.id', 'meal_subscription.user')
    .where('meal', request.params.id);
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

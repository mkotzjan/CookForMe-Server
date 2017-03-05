'use strict';

const db = require('./database');

// User model
var User = db.bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true,
    
    meals: function () {
      return this.belongsToMany(Meal);
    },
    
    meal_subscriptions: function () {
      return this.belongsToMany(MealSubscription);
    }
});

// Meal model
var Meal = db.bookshelf.Model.extend({
    tableName: 'meal',
    hasTimestamps: true,

    user: function () {
      return this.belongsTo(User);
    },

    subscriptions: function () {
      return this.belongsToMany(MealSubscription);
    }
});

// Meal subscriptions model
var MealSubscription = db.bookshelf.Model.extend({
    tableName: 'meal_subscription',

    user: function () {
      return this.belongsTo(User);
    },

    meal: function () {
      return this.belongsTo(Meal);
    }
});

module.exports = {
  User: User,
  Meal: Meal,
  MealSubscription: MealSubscription
}

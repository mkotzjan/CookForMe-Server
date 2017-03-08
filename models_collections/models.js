'use strict';

const con = require('../database/connection');

// User model
var User = con.bookshelf.Model.extend({
    tableName: 'user',
    hasTimestamps: true,
    
    meals: function () {
      return this.belongsToMany(Meal, 'meal', 'id', 'user');
    },
    
    meal_subscriptions: function () {
      return this.belongsToMany(MealSubscription, 'meal_subscription', 'id', 'user');
    }
});

// Meal model
var Meal = con.bookshelf.Model.extend({
    tableName: 'meal',
    hasTimestamps: true,

    user: function () {
      return this.belongsTo(User, 'user', 'user');
    },

    subscriptions: function () {
      return this.belongsToMany(MealSubscription, 'meal_subscriptions', 'id', 'meal');
    }
});

// Meal subscriptions model
var MealSubscription = con.bookshelf.Model.extend({
    tableName: 'meal_subscription',
    hasTimestamps: true,

    user: function () {
      return this.belongsTo(User, 'user', 'id');
    },

    meal: function () {
      return this.belongsTo(Meal, 'meal', 'id');
    }
});

module.exports = {
  User: User,
  Meal: Meal,
  MealSubscription: MealSubscription
}

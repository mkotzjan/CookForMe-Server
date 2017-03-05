'use strict';

const con = require('../database/connection');
const model = require('./models');

var Users = con.bookshelf.Collection.extend({
    model: model.User
});

var Meals = con.bookshelf.Collection.extend({
    model: model.Meal
});

var MealSubscriptions = con.bookshelf.Collection.extend({
    model: model.MealSubscription
});

module.exports = {
  Users: Users,
  Meals: Meals,
  MealSubscriptions: MealSubscriptions
}

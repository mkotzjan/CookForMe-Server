'use strict';

const db = require('./database');
const model = require('./models');

var Users = db.bookshelf.Collection.extend({
    model: model.User
});

var Meals = db.bookshelf.Collection.extend({
    model: model.Meal
});

var MealSubscriptions = db.bookshelf.Collection.extend({
    model.model.MealSubscription
});

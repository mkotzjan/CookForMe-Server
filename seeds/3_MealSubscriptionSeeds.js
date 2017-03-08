function newDatePlusDays(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result.toLocaleString();
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('meal_subscription').del()
    .then(function () {
      // Inserts seed entries
      return knex('meal_subscription').insert([
          {user: 1, meal: 1, created_at: newDatePlusDays(-3), updated_at: newDatePlusDays(-3)},
          {user: 2, meal: 1, created_at: newDatePlusDays(-2), updated_at: newDatePlusDays(-2)},
          {user: 3, meal: 1, created_at: newDatePlusDays(-2), updated_at: newDatePlusDays(-2)},
          {user: 4, meal: 1, created_at: newDatePlusDays(-2), updated_at: newDatePlusDays(-2)},
          {user: 1, meal: 2, created_at: newDatePlusDays(-2), updated_at: newDatePlusDays(-2)},
          {user: 5, meal: 2, created_at: newDatePlusDays(-1), updated_at: newDatePlusDays(-1)},
          {user: 1, meal: 3, created_at: newDatePlusDays(-1), updated_at: newDatePlusDays(-1)},
          {user: 2, meal: 4, created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},
          {user: 4, meal: 4, created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},       
          {user: 2, meal: 5, created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},       
          {user: 3, meal: 6, created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},       
          {user: 4, meal: 7, created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},       
      ]);
    });
};

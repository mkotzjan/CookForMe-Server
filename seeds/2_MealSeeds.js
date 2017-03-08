function newDatePlusDays(days) {
  var result = new Date();
  result.setDate(result.getDate() + days);
  return result.toLocaleString();
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('meal').del()
    .then(function () {
      // Inserts seed entries
      return knex('meal').insert([
          {user: 1, title: 'Spaghetti', description: 'With pesto!', amount: 4, meeting_place: 'At C2.03', meeting_date: newDatePlusDays(-1), subscriptions_until: newDatePlusDays(-2), created_at: newDatePlusDays(-3), updated_at: newDatePlusDays(-3)},
          {user: 1, title: 'Risotto', description: 'Includes pumpkin', amount: 3, meeting_place: 'At C2.03', meeting_date: newDatePlusDays(0), subscriptions_until: newDatePlusDays(-1), created_at: newDatePlusDays(-2), updated_at: newDatePlusDays(-2)},
          {user: 1, title: 'Salad', description: 'Made of carrots', amount: 5, meeting_place: 'At C2.03', meeting_date: newDatePlusDays(1), subscriptions_until: newDatePlusDays(0), created_at: newDatePlusDays(-1), updated_at: newDatePlusDays(-1)},
          {user: 2, title: 'Just cheese', description: 'Look at the title', amount: 3, meeting_place: 'B0.01', meeting_date: newDatePlusDays(2), subscriptions_until: newDatePlusDays(1), created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},
          {user: 2, title: 'Rice Salad', description: 'Cold!', amount: 4, meeting_place: 'B0.01', meeting_date: newDatePlusDays(3), subscriptions_until: newDatePlusDays(2), created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},
          {user: 3, title: 'Burger and fries', description: '', amount: 4, meeting_place: 'In front of school', meeting_date: newDatePlusDays(2), subscriptions_until: newDatePlusDays(1), created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)},
          {user: 4, title: 'Chicken soup', description: 'Noodles inside', amount: 4, meeting_place: 'At my car', meeting_date: newDatePlusDays(3), subscriptions_until: newDatePlusDays(2), created_at: newDatePlusDays(0), updated_at: newDatePlusDays(0)}
      ]);
    });
};

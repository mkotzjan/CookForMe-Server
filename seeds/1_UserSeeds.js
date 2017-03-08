
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
          {username: 'user1', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {username: 'user2', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {username: 'user3', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {username: 'user4', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {username: 'user5', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
      ]);
    });
};

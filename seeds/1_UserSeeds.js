
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
          {email: 'user1@email.com', firstname: 'User1', lastname: 'Name', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {email: 'user2@email.com', firstname: 'User2', lastname: 'Name', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {email: 'user3@email.com', firstname: 'User3', lastname: 'Name', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {email: 'user4@email.com', firstname: 'User4', lastname: 'Name', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
          {email: 'user5@email.com', firstname: 'User5', lastname: 'Name', password: '$2y$10$JrVZzBtz.MExHCEj4A1Oe.eHwlxaua4A0WJmtbZG7d5127NghSIyi', created_at: new Date().toLocaleString(), updated_at: new Date().toLocaleString()},
      ]);
    });
};

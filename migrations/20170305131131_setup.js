
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user', function(table) {
      table.increments('id');
      table.string('username', 30).unique().notNullable();
      table.string('password', 30).notNullable();
      table.timestamps();
    }),
    knex.schema.createTable('meal', function(table) {
      table.increments('id');
      table.integer('user').unsigned().references('id').inTable('user').onDelete('CASCADE').notNullable();
      table.string('title', 50).notNullable();
      table.string('description').notNullable();
      table.integer('amount').notNullable();
      table.string('meeting_place').notNullable();
      table.dateTime('meeting_date').notNullable();
      table.dateTime('subscriptions_until').notNullable();
      table.timestamps();
    }),
    knex.schema.createTable('meal_subscription', function(table) {
      table.increments('id');
      table.integer('meal').unsigned().references('id').inTable('meal').onDelete('CASCADE').notNullable();
      table.integer('user').unsigned().references('id').inTable('user').onDelete('CASCADE').notNullable();
      table.timestamps();
      table.unique(['meal', 'user']);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.dropTable('meal_subscription'),
      knex.schema.dropTable('meal'),
      knex.schema.dropTable('user')
  ])
};

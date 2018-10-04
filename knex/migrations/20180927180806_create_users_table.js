exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', table => {
      table.increments('user_id').primary();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.boolean('isAdmin').defaultTo(false);
      // table.timestamp('created_at').defaultTo(knex.fn.now());
      // table.timestamp('updated_at').defaultTo(knex.fn.now());

      // shorthand notation for created_at updated_at
      table.timestamps(true, true);
    })
    .createTable('images', table => {
      table.increments('image_id').primary();
      table.string('title').notNullable();
      table.string('author').notNullable();
      table.string('link').notNullable();
      table.string('description').notNullable();
      table.boolean('featured').notNullable().defaultTo(false); 
      // table.boolean('is_complete').defaultTo(false);
      table.integer('user_id').references('user_id').inTable('users').onDelete('cascade');
      table.timestamps(true, true);
    })
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('images')
    .dropTable('users');
};
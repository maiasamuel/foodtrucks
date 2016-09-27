
exports.up = function(knex, Promise) {
  return knex.schema.createTable('event', function(table){
    table.increments('id');
    table.text('truck_id');
    table.string('date');
    table.string('location');
    table.integer('open_time');
    table.integer('close_time');
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'));
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('event')
};


exports.up = function(knex) {
    return knex.schema.createTable('roles', t => {
        t.increments('id').primary()
        t.string('name')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

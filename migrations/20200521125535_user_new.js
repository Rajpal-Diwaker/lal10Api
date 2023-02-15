
exports.up = function(knex) {
    return knex.schema.createTable('users', t => {
        t.increments('id').primary()
        t.string('email')
        t.string('password')
        t.string('role')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.unique('email')
    })
};

exports.down = function(knex) {
  
};

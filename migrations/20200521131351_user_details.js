
exports.up = function(knex) {
    return knex.schema.createTable('user_details', t => {
        t.increments('id').primary()
        t.string('name')
        t.string('profileImage')
        t.string('state')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema.createTable('uploads', t => {
        t.increments('id').primary()
        t.string('uri').notNullable()
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

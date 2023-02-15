
exports.up = function(knex) {
    
    return knex.schema.createTable('notifications', t => {
        t.increments('id').primary()
        t.string('type')
        t.text('message','longtext')
        t.string('action')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

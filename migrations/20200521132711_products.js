
exports.up = function(knex) {
    return knex.schema.createTable('products', t => {
        t.increments('id').primary()        
        t.string('name')
        .notNull()
        t.integer('amount')
        .notNull()
        t.integer('qty')
        .defaultTo(0)
        t.integer('material')
        t.text('description','longtext')
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

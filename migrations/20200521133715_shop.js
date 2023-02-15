
exports.up = function(knex) {
    return knex.schema.createTable('shop', t => {
        t.increments('id').primary()
        t.string('inventory_qty')
        .defaultTo('0')
        t.integer('productId')
        .references('id')
        .inTable('products')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

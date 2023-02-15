
exports.up = function(knex) {
  return knex.schema.createTable('sub_type', t => {
        t.increments('id').primary()
        t.string('type')
        t.integer('categoryId')
        .references('id')
        .inTable('category')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

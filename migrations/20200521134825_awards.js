
exports.up = function(knex) {
    return knex.schema.createTable('awards', t => {
        t.increments('id').primary()
        t.string('image')
        t.string('title')
        t.integer('totalAwards')
        .defaultTo(0)
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.specificType('isActive', 'tinyint(1)');
        t.specificType('isPublished', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

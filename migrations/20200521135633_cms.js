
exports.up = function(knex) {
    return knex.schema.createTable('cms', t => {
        t.increments('id').primary()
        t.string('type')
        t.text('description','longtext')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

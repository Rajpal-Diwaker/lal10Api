
exports.up = function(knex) {
    return knex.schema.createTable('onboarding', t => {
        t.increments('id').primary()
        t.integer('ranking')
        t.string('image')
        t.text('description','longtext')
        t.string('language')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

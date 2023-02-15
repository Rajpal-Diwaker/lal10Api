
exports.up = function(knex) {
    return knex.schema.createTable('options', t => {
        t.increments('id').primary()
        t.string('name')
        t.string('type')
        t.specificType('isActive', 'tinyint(1)');
        t.timestamp('created_at').defaultTo(knex.fn.now())      
    })
};

exports.down = function(knex) {
  
};

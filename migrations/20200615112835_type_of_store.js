
exports.up = function(knex) {
  return knex.schema.createTable('type_of_store', t => {
        t.increments('id').primary()
        t.string('name') 
        t.string('icon')
        t.string('description')   
        t.specificType('isActive', 'tinyint(1)');            
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

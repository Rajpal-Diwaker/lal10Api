
exports.up = function(knex) {
  return knex.schema.createTable('customer_important_sample', t => {
        t.increments('id').primary()
        t.string('type') 
        t.string('icon')               
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

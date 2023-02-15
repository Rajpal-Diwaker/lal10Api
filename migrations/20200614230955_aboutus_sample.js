
exports.up = function(knex) {
   return knex.schema.createTable('aboutus_sample', t => {
        t.increments('id').primary()
        t.string('type')                        
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

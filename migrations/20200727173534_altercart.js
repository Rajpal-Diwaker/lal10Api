
exports.up = function(knex) {
    return knex.schema        

    .alterTable('cart', function(t) { 
            t.string('description')            
            t.integer('expPrice')                                            
        })
};

exports.down = function(knex) {
  
};

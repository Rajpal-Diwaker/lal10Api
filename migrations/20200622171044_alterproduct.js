
exports.up = function(knex) {
    return knex.schema
    .alterTable("products", (t) => {        
        t.enum('plive',['1','0']).defaultTo('0').comment('1->live product,0->non live product')        
        t.integer('categoryId')       
    })
};

exports.down = function(knex) {
  
};
    

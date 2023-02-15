
exports.up = function(knex) {
    return knex.schema 
    
    .alterTable('cart', function(t) {	         
        t.specificType('orderPlace', 'tinyint(1)').defaultTo(0).comment('0->No Operationi,1->OrderPlace,2->No qty exist Reject')
        t.date('orderPlaceDate')
     })

};

exports.down = function(knex) {
  
};

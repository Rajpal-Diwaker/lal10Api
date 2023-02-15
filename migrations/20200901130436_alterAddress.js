
exports.up = function(knex) {
  
    return knex.schema 
    
    .alterTable('address', function(t) {	         
        t.string('latlong')
     })

    .alterTable('production_tracker', function(t) {	
        t.specificType('productionStatus','tinyint(3)').defaultTo(0).alter()
        t.specificType('paymentStatus','tinyint(3)').defaultTo(0).alter()                
     })

};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema 

    .alterTable('user_details', function(t) {	         
        t.string('name2')        
    })      


    .alterTable('address', function(t) {	         
        t.string('addressName')        
    })   
        
    .alterTable('estimate', function(t) {	         
      t.specificType('deleted', 'tinyint(1)').defaultTo(1).comment('0->Active,0->soft deleted')                            
    })   
};

exports.down = function(knex) {
  
};

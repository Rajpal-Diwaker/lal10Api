
exports.up = function(knex) {
    return knex.schema 

    .alterTable('users', function(t) {	         
        t.string('verifyLink')
        t.specificType('verifyLinkUsed', 'tinyint(1)').defaultTo(0).comment('1->used,0->unUsed')
        t.specificType('forgotTokenUsed', 'tinyint(1)').defaultTo(0).comment('1->used,0->unUsed')                      
    })       
        
};

exports.down = function(knex) {
  
};

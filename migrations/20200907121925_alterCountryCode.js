
exports.up = function(knex) {
    return knex.schema 
    .alterTable('users', function(t) {	             
        t.string('countryCode', 10).defaultTo('')
     })
};

exports.down = function(knex) {
  
};

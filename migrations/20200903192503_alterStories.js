
exports.up = function(knex) {
    return knex.schema 
    .alterTable('stories', function(t) {	         
        t.string('image').defaultTo('')
     })
};

exports.down = function(knex) {
  
};

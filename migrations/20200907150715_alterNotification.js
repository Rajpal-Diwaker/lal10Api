
exports.up = function(knex) {
    return knex.schema 
    .alterTable('notifications', function(t) {	         
        t.string('type').defaultTo('custom')
    });
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema
    .alterTable('artisan_details', function(t) {
        t.string('name').notNull()
    });
};

exports.down = function(knex) {
  
};

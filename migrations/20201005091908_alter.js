
exports.up = function(knex) {
    return knex.schema
    .alterTable('estimate', function(t) {
        t.integer('assignUserId')
    })
};

exports.down = function(knex) {

};

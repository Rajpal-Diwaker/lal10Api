
exports.up = function(knex) {
    return knex.schema.alterTable('users', t => {
        t.string('mobile')
        t.unique('mobile')
    })
};

exports.down = function(knex) {
  
};

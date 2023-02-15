
exports.up = function(knex) {
    return knex.schema.alterTable('users', t => {
        t.string('token')
        t.string('forgotToken')
    })
};

exports.down = function(knex) {
  
};

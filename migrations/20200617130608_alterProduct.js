
exports.up = function(knex) {
    return knex.schema
    .alterTable("products", (t) => {
        t.integer('craft')
    })
};

exports.down = function(knex) {
  
};

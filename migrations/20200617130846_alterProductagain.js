
exports.up = function(knex) {
    return knex.schema
    .alterTable("products", (t) => {
        t.string('searchTags')
    })
};

exports.down = function(knex) {
  
};

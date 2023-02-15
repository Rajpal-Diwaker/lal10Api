
exports.up = function(knex) {
    return knex.schema
    .alterTable("options", (t) => {
        t.string('url', 150)
    })
};

exports.down = function(knex) {
  
};

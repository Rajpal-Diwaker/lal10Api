
exports.up = function(knex) {
    return knex.schema
    .alterTable("newsfeed", (t) => {
        t.string('url', 100)
    })
};

exports.down = function(knex) {
  
};

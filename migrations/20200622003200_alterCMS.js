
exports.up = function(knex) {
  return knex.schema
    .alterTable("cms", (t) => {
        t.string('name', 100)
    })
};

exports.down = function(knex) {
  
};

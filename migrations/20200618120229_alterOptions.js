
exports.up = function(knex) {
   return knex.schema
    .alterTable("options", (t) => {
        t.string('image', 100)
    })
};

exports.down = function(knex) {
  
};

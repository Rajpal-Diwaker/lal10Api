
exports.up = function(knex) {
    return knex.schema
    .alterTable("products", (t) => {
        t.renameColumn('qty', 'inventoryQty');
        t.integer('doableQty')
    })
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {    
    return knex.schema
    // .alterTable("cart_relation", (t) => {
    //     t.dropForeign('cartId')
    //     t.dropColumn('cartId')        
    //   })

    .alterTable('cart_relation', function(t) {
        t.string('uniqueId')    
        t.specificType('isActive', 'tinyint(1)').default(1).comment('1->active,0->Inactive')     
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade');
    });
};

exports.down = function(knex) {
  
};

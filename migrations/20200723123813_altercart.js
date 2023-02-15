
exports.up = function(knex) {
    return knex.schema        
    .dropTable('cart_relation')

    .alterTable('cart', function(t) {        
        t.string('uniqueId')
        t.integer('productId').references('id').inTable('products').notNull().unsigned().onDelete('cascade')
        t.integer('qty')                                
        t.enum('type', ['1','0']).comment('1->EnquiryCart,0->LiveShopCart')            
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
        t.enum('deleted', ['1','0']).defaultTo(1).comment('1->for active,0->Inactive')            
    })
};

exports.down = function(knex) {
  
};

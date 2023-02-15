
exports.up = function(knex) {
    return knex.schema 

    .createTable('websiteOrder', function(t) {	         
        t.increments('id').primary()
        t.string('uniqueId')  
        t.integer('addressId')        
        .references('id')
        .inTable('address')
        .notNull()
        .unsigned()
        .onDelete('cascade')   
        t.integer('productId')        
        .references('id')
        .inTable('products')
        .notNull()
        .unsigned()
        .onDelete('cascade')   
        t.integer('qty')
        t.integer('price')                
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')       
        t.string('orderStatus')          
        t.date('orderExpDate')        
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')        
        t.timestamp('created_at').defaultTo(knex.fn.now())        
    }) 
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema.createTable('invoice', t => {
        t.increments('id').primary()
        t.string('uniqueId')  
        t.integer('enqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade')                 
        t.integer('userId').references('id').inTable('users').notNull().unsigned().onDelete('cascade')                 
        t.string('invoiceTo')        
        t.string('shipTo')        
        t.string('placeOfSupply')        
        t.string('currency')        
        t.string('qty')        
        t.string('productName') 
        t.string('unit')        
        t.integer('rate') 
        t.string('tax')        
        t.datetime('dueDate')        
        t.string('subTotal')        
        t.string('url')        
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active the Record,0->Not Active the Record')  
        t.specificType('deleted', 'tinyint(1)').defaultTo(1).comment('0->Active,0->soft deleted')                     
        t.timestamp('createdAt').defaultTo(knex.fn.now())        
        t.integer('created_by')
    })  
};

exports.down = function(knex) {
  
};

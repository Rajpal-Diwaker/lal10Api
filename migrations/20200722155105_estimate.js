
exports.up = function(knex) {
    return knex.schema.createTable('estimate', t => {
        t.increments('id').primary()
        t.string('uniqueId')  
        t.integer('enqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade')                 
        t.string('address')        
        t.string('shipTo')        
        t.string('estimateNo')        
        t.string('productName')        
        t.string('unit')        
        t.string('estimateRate')        
        t.string('tax')        
        t.integer('amount')        
        t.string('subTotal')        
        t.string('acceptedBy')        
        t.datetime('acceptedDate')        
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active the Record,0->Not Active the Record')                     
        t.timestamp('createdAt').defaultTo(knex.fn.now())        
        t.integer('created_by')
    })  
  
};

exports.down = function(knex) {
  
};

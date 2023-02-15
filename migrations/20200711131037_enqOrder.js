
exports.up = function(knex) {
    return knex.schema.createTable('enquiry_order', t => {
        t.increments('id').primary()
        t.string('uniqueId')
        t.integer('enqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade') 
        t.integer('assignUserId').references('id').inTable('users').notNull().unsigned().onDelete('cascade')         
        t.specificType('adminAssign', 'tinyint(1)').defaultTo(0).comment('1->assign,0->not assign')         
        t.specificType('orderAccept', 'tinyint(1)').defaultTo(0).comment('0->pending,1->Accept the order,2->Reject the order')                    
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active the Record,0->Not Active the Record')                     
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.dateTime('updated_at')
        t.integer('updated_by').references('id').inTable('users').notNull().unsigned().onDelete('cascade')
    })
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema.createTable('enquiry_attachment', t => {
        t.increments('id').primary()
        t.integer('enqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade')                         
        t.string("attachment")
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active the Record,0->Not Active the Record')                     
        t.timestamp('created_at').defaultTo(knex.fn.now())        
    })  
};

exports.down = function(knex) {
  
};

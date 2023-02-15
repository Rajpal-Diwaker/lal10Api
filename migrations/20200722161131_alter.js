
exports.up = function(knex) {
    return knex.schema            
    .alterTable('po', function(t) {
        t.renameColumn('product_name', 'productName')
        t.integer('enqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade')
        t.integer('assignUserId').references('id').inTable('users').notNull().unsigned().onDelete('cascade')  
        t.string('supplier')
        t.string('shipTo')
        t.string('unit')
        t.integer('amount')
        t.datetime('dueDate')
        t.integer('subTotal')    
        t.integer('discount')   
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
        t.enum('deleted', ['1','0']).defaultTo(1).comment('1->for active,0->Inactive')
        t.integer('created_by')
    })
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema        
        .alterTable('production_tracker', function(t) {
            t.integer('EnqId').references('id').inTable('enquiries').notNull().unsigned().onDelete('cascade')
            t.datetime('deliveryDate')    
            t.specificType('isActive', 'tinyint(1)').default(1).comment('1->active,0->Inactive')     
            t.integer('userId').references('id').inTable('users').notNull().unsigned().onDelete('cascade')
    });
}

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema        
    .createTable("product_group", (t) => {
        t.increments("id").primary()                             
        t.string('group_name')                
        t.string('total_product')                
        t.string('craft')                
        t.timestamp("created_at").defaultTo(knex.fn.now())
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')    
        t.integer('created_by').references('id').inTable('users').notNull().unsigned().onDelete('cascade')                                          
    })
};

exports.down = function(knex) {
  
};

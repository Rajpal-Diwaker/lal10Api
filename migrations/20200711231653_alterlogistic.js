
exports.up = function(knex) {
    
    return knex.schema        
        
        .dropTable('logistics_detail', function(t) {})
        
        .createTable("logistics_detail", (t) => {
            t.increments("id").primary()               
            t.integer('orderId').references('id').inTable('enquiry_order').unsigned().onDelete('cascade')      
            t.string('carrier')
            t.string('trackingNo')
            t.string('boxes')      
            t.string('paymentMode')            
            t.integer('userId').references('id').inTable('users').unsigned().onDelete('cascade')            
            t.timestamp("created_at").defaultTo(knex.fn.now())
            t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')                      
        })
    };

exports.down = function(knex) {
  
};

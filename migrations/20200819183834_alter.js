
exports.up = function(knex) {
    return knex.schema        
    
    .alterTable('production_tracker', function(t) {        
        t.integer('orderId').references('id').inTable('enquiry_order').notNull().unsigned().onDelete('cascade')   
        t.string('files')                 
    })

    .alterTable('production_tracker', function(t) {	 
        t.dropForeign('EnqId');
        t.dropColumn('EnqId');                      
    });
    

};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema        
    .createTable("brand", (t) => {
        t.increments("id").primary()                             
        t.string('brandName')
        t.string('logo')    
        t.integer('userId').references('id').inTable('users').unsigned().onDelete('cascade')            
        t.timestamp("created_at").defaultTo(knex.fn.now())
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')                      
    })

    .createTable("subscribe", (t) => {
        t.increments("id").primary()                             
        t.string('email')                
        t.timestamp("created_at").defaultTo(knex.fn.now())
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')                      
    })
};

exports.down = function(knex) {
  
};

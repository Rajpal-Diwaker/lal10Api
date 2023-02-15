
exports.up = function(knex) {
    
    return knex.schema 

    .alterTable('production_tracker', function(t) {	         
        t.dropColumn('files')        
    }) 
  
    .createTable('productionFiles', t => {
        t.increments('id').primary()
        t.integer('tracker_id')
        .references('id')
        .inTable('production_tracker')
        .notNull()
        .unsigned()
        .onDelete('cascade')                       
        t.string('files')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

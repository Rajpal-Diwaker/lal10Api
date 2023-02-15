
exports.up = function(knex) {
    return knex.schema 

    .createTable('subAdminRole', function(t) {	             
        t.increments('id').primary()
        t.string('title')                                
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })

    .createTable('subAdminRoleType', function(t) {	             
        t.increments('id').primary()
        t.string('subAdminRoleId')    
        t.string('groupName')
        t.string('totalArtisan')        
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')                                  
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })


    .createTable('subAdminCategory', function(t) {	             
        t.increments('id').primary()
        t.string('categoryId')                        
        t.string('subcategoryId')        
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')                                  
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })
};

exports.down = function(knex) {
  
};

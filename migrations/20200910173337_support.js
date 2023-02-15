
exports.up = function(knex) {
    return knex.schema 
    .createTable('support', function(t) {	             
        t.increments('id').primary()
        t.string('title')
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })

    .createTable('user_support', function(t) {	             
        t.increments('id').primary()
        t.integer('supportId')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')  
        t.string('description')
        t.specificType('isActive','tinyint(3)').defaultTo(1)                
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })
};

exports.down = function(knex) {
  
};

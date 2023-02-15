
exports.up = function(knex) {
    return knex.schema 

    .dropTable('notifications')

    .createTable('notifications', function(t) {	         
        t.increments('id').primary()
        t.string('title')
        t.string('description')        
        t.string('gcmId')        
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')   
        t.specificType('sendStatus', 'tinyint(1)').defaultTo(0).comment('1->Send,0->NotSend')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.specificType('isRead', 'tinyint(1)').defaultTo(0).comment('1->Read,0->UnRead')
        t.timestamp('created_at').defaultTo(knex.fn.now())        
    }) 
};

exports.down = function(knex) {
  
};

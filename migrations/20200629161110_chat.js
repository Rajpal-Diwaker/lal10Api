
exports.up = function(knex) {
    return knex.schema.createTable('chat', t => {
        t.increments('id').primary()
        t.integer('EnqId')
        .references('id')
        .inTable('enquiries')
        .notNull()
        .unsigned()
        .onDelete('cascade')                       
        t.integer('fromId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')                       
        t.integer('toId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade') 
        t.string('message')
        t.string('files') 
        t.string('price')                                    
        t.specificType('isRead', 'tinyint(1)').defaultTo(0).comment('1->for Read,0->UnRead')  
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.enum('type',['text','image','video','doc']).defaultTo('text')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

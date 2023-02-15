
exports.up = function(knex) {
    return knex.schema.createTable('comment_history', t => {
        t.increments('id').primary()
        t.integer('chatId')
        .references('id')
        .inTable('chat')
        .notNull()
        .unsigned()
        .onDelete('cascade')                       
        t.string('comment')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

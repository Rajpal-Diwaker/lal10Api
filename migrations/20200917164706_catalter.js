
exports.up = function(knex) {
    return knex.schema 
    .alterTable('category', function(t) {	                     
        t.integer('verified').default('0').comment('0->unverfied not showing on website 1->verified')        
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')        
    })
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema 

    .createTable('notificationList', function(t) {	             
        t.increments('id').primary()
        t.string('type')        
        t.string('to')
        t.string('description')
        t.string('groupName')
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())       
    })

};

exports.down = function(knex) {
  
};

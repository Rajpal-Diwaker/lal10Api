
exports.up = function(knex) {
  return knex.schema.createTable('store', t => {
        t.increments('id').primary()
        t.string('type')
        t.string('store')
        t.string('year')
        t.string('bussiness')
        t.string('postalCode')
        t.string('websiteUrl')        
        t.text('description','longtext')
        t.string('customerImportant')      
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')               
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

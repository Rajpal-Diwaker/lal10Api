
exports.up = function(knex) {    
        return knex.schema.createTable('productImage', t => {
            t.increments('id').primary()
            t.integer('productId')
            .references('id')
            .inTable('products')
            .notNull()
            .unsigned()
            .onDelete('cascade')               
            t.string('image')                                    
            t.integer('userId')
            .references('id')
            .inTable('users')
            .notNull()
            .unsigned()
            .onDelete('cascade')         
            t.specificType('isActive', 'tinyint(1)').defaultTo(1);               
            t.timestamp('created_at').defaultTo(knex.fn.now())
        })
};

exports.down = function(knex) {
  
};

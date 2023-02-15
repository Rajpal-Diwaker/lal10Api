
exports.up = function(knex) {
    return knex.schema 

    .createTable('gallery', function(t) {	         
        t.increments('id').primary()
        t.text('title','longtext')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')   
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.timestamp('created_at').defaultTo(knex.fn.now())        
    }) 
  
    .createTable('galleryImage', t => {
        t.increments('id').primary()
        t.integer('gallery_id')
        .references('id')
        .inTable('gallery')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')                       
        t.string('images')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->Active,0->Inactive')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

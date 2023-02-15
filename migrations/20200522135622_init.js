
exports.up = function(knex) {
    return knex.schema
    .createTable('category', t => {
        t.increments('id').primary()
        t.string('title', 100)
        t.integer('parentId')
        .references('id')
        .inTable('category')
        .unsigned()
        .defaultTo(0)
        .onDelete('cascade')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('newsfeed', t => {
        t.increments('id').primary()
        t.string('image', 100)
        t.string('title', 100)
        t.text('description', 'longtext')
        t.specificType('isActive', 'tinyint(1)');
        t.specificType('isPublished', 'tinyint(1)')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .alterTable('uploads', t => {
        t.string('type', 20)
    })
    .createTable('groups', t => {
        t.increments('id').primary()
        t.string('name', 100)
        t.integer('filterId')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .unsigned()
        .onDelete('cascade')
        t.specificType('isActive', 'tinyint(1)')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .alterTable('cms', t => {
        t.string('title')
        t.string('link', 100)
    })
    .createTable('infographics', t => {
        t.increments('id').primary()
        t.string('totalProducts', 50)
        t.string('unitsDelivered', 50)
        t.string('exportedTo', 100)
        t.string('image', 100)
        t.string('country', 100)
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('infographics_states', t => {
        t.increments('id').primary()
        t.string('state', 100)
        t.string('totalArtisan', 20)
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('stories', t => {
        t.increments('id').primary()
        t.string('title', 100)
        t.text('description', 'longtext')
        t.specificType('isActive', 'tinyint(1)')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('avenue', t => {
        t.increments('id').primary()
        t.string('title', 100)
        t.text('description', 'longtext')
        t.string('image', 100)
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('settings', t => {
        t.increments('id').primary()
        t.string('title', 100)
        t.text('description', 'longtext')
        t.string('type', 20)
        t.specificType('isActive', 'tinyint(1)')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })   
    .createTable('receipts', t => {
        t.increments('id').primary()
        t.string('url', 100)
        t.string('type', 10)
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('po', t => {
        t.increments('id').primary()
        t.string('product_name')
        t.string('qty')
        t.datetime('estimatedDelivery', { precision: 6 })
        t.string('price')
        t.string('gst', 10)
        t.string('address')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

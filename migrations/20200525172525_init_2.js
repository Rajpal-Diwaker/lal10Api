
exports.up = function(knex) {
    return knex.schema
    .createTable('artisan_details', t => {
        t.increments('id').primary()
        t.string('kyc')
        t.string('image')
        t.string('state', 50)
        t.integer('craft')
        t.integer('product')
        t.integer('material')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('logistics_detail', t => {
        t.increments('id').primary()
        t.integer('carrier')
        t.string('trackingNo', 50)
        t.integer('boxes')
        t.integer('paymentMode')
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('group', t => {
        t.increments('id').primary()
        t.string('name', 50)
        t.string('type', 10)
        t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
    .createTable('groupRelations', t => {
        t.increments('id').primary()
        t.integer('typeId')
        t.integer('groupId')
        .references('id')
        .inTable('group')
        .notNull()
        .unsigned()
        .onDelete('cascade')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
};

exports.down = function(knex) {
  
};

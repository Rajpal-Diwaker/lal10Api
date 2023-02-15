
exports.up = function(knex) {

    return knex.schema
    .createTable('order_invoice_url', function(t) {
        t.integer('orderId')
        t.specificType('isActive','tinyint(3)').defaultTo(1)
        t.specificType('isDeleted','tinyint(3)').defaultTo(1)
        t.string('image')
        t.timestamp('createdAt').defaultTo(knex.fn.now())
    })

    .createTable('user_exhibition', function(t) {
        t.increments('id').primary()
        t.string('email')
        t.string('mobile')
        t.string('exhibitionId')
        t.specificType('isActive','tinyint(3)').defaultTo(1)
        t.specificType('isDeleted','tinyint(3)').defaultTo(1)
        t.timestamp('createdAt').defaultTo(knex.fn.now())
    })

    .createTable('products_log', function(t) {
        t.integer('id')
        t.string('name')
        t.integer('amount')
        t.integer('inventoryQty')
        t.integer('material')
        t.string('description')
        t.integer('userId')
        t.specificType('isActive','tinyint(3)').defaultTo(1)
        t.timestamp('created_at').defaultTo(knex.fn.now())
        t.integer('doableQty')
        t.integer('craft')
        t.string('searchTags')
        t.enum('plive',['0','1']).default(1).comment('1->live Product ,0->Non live product')
        t.integer('categoryId')
        t.integer('subcategoryId')
        t.enum('publish',['0','1']).default(1).comment('1->live Product ,0->Non live product')
        t.enum('addingBestselling',['0','1']).default(1).comment('1->live Product ,0->Non live product')
        t.string('addingBestsellingComment')
        t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->soft delete')
        t.enum('verified',['0','1']).default(0).comment('1->verified ,0->Non live verified product')
        t.enum('ideal',['0','1']).default(0).comment('1->ideal Product ,0->Non live ideal product')
        t.string('sku')
        t.integer('productId')
    })

};

exports.down = function(knex) {

};

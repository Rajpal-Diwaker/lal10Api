
exports.up = function(knex) {
    return knex.schema
    .createTable("cart", (t) => {
      t.increments("id").primary();
      t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("cart_relation", (t) => {
      t.increments("id").primary();           
      t.integer('productId')
        .references('id')
        .inTable('products')
        .notNull()
        .unsigned()
        .onDelete('cascade')
      t.string('qty', 10)  
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("card", (t) => {
      t.increments("id").primary();
      t.string('cardNo', 20)
      t.string('name', 50)
      t.datetime('expiry')
      t.string('cvv', 5)
      t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
      t.string('qty', 10)  
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("cron_history", (t) => {
      t.increments("id").primary();
      t.string('type', 10)
      t.text('body')
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("address", (t) => {
      t.increments("id").primary();
      t.string('name', 50)
      t.integer('countryId')
      t.text('addLine1')
      t.text('street')
      t.integer('cityId')
      t.integer('stateId')
      t.string('zip', 10)
      t.string('mobNo', 15)
      t.specificType('defaultAdd', 'tinyint(1)')
      t.integer('userId')
        .references('id')
        .inTable('users')
        .notNull()
        .unsigned()
        .onDelete('cascade')
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .alterTable('artisan_details', function(t) {
     t.renameColumn('kyc', 'kycImage')
     t.renameColumn('image', 'artisanImage')
     t.integer('userId')
     .references('id')
     .inTable('users')
     .notNull()
     .unsigned()
     .onDelete('cascade')
    });
};

exports.down = function(knex) {
  
};

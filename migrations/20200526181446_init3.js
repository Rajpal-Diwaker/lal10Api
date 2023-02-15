exports.up = function (knex) {
  return knex.schema
    .createTable("production_tracker", (t) => {
      t.increments("id").primary();
      t.integer("productionStatus");
      t.integer("paymentStatus");
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("otp_verification", (t) => {
      t.increments("id").primary();
      t.string("otp", 6);
      t.specificType('isVerified', 'tinyint(1)')
      t.integer("userId")
        .references("id")
        .inTable("users")
        .unsigned()
        .onDelete("cascade");
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .renameTable('groupRelations', 'group_relations')
    .raw(`ALTER TABLE category ALTER parentId SET DEFAULT NULL`)
};

exports.down = function (knex) {
  // return knex.schema
  // .dropTable('groups')
};

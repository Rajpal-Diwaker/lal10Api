
exports.up = function(knex) {
    return knex.schema
        .alterTable('enquiry_order', function(t) {
            t.integer('created_by').references('id').inTable('users').notNull().unsigned().onDelete('cascade')
        })

        .alterTable('users', function(t) {
            t.enum('is_verified',['0','1'])
            t.dropColumn('otp')
        })

        .alterTable("products", (t) => {
            t.string('subcategoryId')
            t.enum('publish',['1','0']).default(0).comment('1->publish for web,0->un Publish')
            t.enum('addingBestselling',['1','0']).default(0).comment('1->Best Selling Product,0->Non best Selling Product')
            t.string("addingBestsellingComment")
        })

        // .dropTableIfExists('group')
        .dropTableIfExists('group_relations')
        // .dropTableIfExists('groups')


        .createTable("artisan_group", (t) => {
            t.increments("id").primary()
            t.string('group_name')
            t.string('total_artisan')
            t.string('craft')
            t.timestamp("created_at").defaultTo(knex.fn.now())
            t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
            t.integer('created_by').references('id').inTable('users').notNull().unsigned().onDelete('cascade')
        })
};

exports.down = function(knex) {

};

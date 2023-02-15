
exports.up = function(knex) {
    return knex.schema
    .alterTable('products', function(t) {
        t.integer('subsubcategoryId')
        t.string('vendorName')
    })

    .alterTable('subAdminRoleType', function(t) {
        t.string('groupId')
    })

};

exports.down = function(knex) {

};

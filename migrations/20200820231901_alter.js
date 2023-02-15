
exports.up = function(knex) {

    return knex.schema

    .alterTable('artisan_details', function(t) {
        t.dropColumn('craft')
        t.dropColumn('product')
        t.dropColumn('material')
    })

    // .alterTable('products', function(t) {
    //     t.dropColumn('image')
    // })

    .alterTable('address', function(t) {
        t.string('countryId').alter()
        t.string('cityId').alter()
        t.string('stateId').alter()
        t.string('addressType')
        t.string('defaultAdd').default(0).alter()
    })

    .alterTable('card', function(t) {
        t.string('bankName')
        t.dropColumn('qty')
        t.string('expiry').alter()
    })

};

exports.down = function(knex) {

};


exports.up = function(knex) {
    return knex.schema
    .alterTable('options', function(t) {
        t.string('hindiName')
        t.string('bangaliName')
        t.string('gujratiName')
        t.string('stateId')
        t.string('craftId')
        t.string('materialId')
    })

    .alterTable('onboarding', function(t) {
        t.string('hindiDescription')
        t.string('bangaliDescription')
        t.string('gujratiDescription')
    })

    .alterTable('support', function(t) {
        t.string('hindiDescription')
        t.string('bangaliDescription')
        t.string('gujratiDescription')
    })

    .alterTable('enquiries', function(t) {
        t.string('productSku')
        t.string('productSkuArtisanId')
        t.string('pproductId')
        t.string('estateId')
    })

    .alterTable('products', function(t) {
        t.string('pstateId')
    })

    .alterTable('enquiry_order', function(t) {
        t.string('update_status2')
    })

    // ALTER TABLE `enquiries`  ADD `pproductId` VARCHAR(255) NOT NULL  AFTER `messageId`;
};

exports.down = function(knex) {

};


exports.up = function(knex) {
    return knex.schema
    .alterTable('enquiry_order', function(t) {
        t.string('razorpayOrderId')
        t.string('razorpayPaymentId')
        t.string('addressId')
        t.string('productName')
        t.string('productPrice')
        t.string('productQty')
        t.string('signature')
        t.string('orderUserId')
        t.string('orderUserName')
    })
};

exports.down = function(knex) {

};

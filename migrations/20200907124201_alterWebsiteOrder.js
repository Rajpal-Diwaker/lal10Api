
exports.up = function(knex) {
    return knex.schema 
  
    .alterTable('websiteOrder', function(t) {	         
        t.string('razorpayOrderId').defaultTo('')
        t.string('razorpayPaymentId').defaultTo('')
        t.string('signature').defaultTo('')
    });
};

exports.down = function(knex) {
  
};


exports.up = function(knex) {
    return knex.schema

    .alterTable('otp_verification', function(t) {
        t.dropForeign('userId')
        t.dropColumn('userId')
        t.string('mobile')
        t.renameColumn('isVerified','isUsed')
     })

};

exports.down = function(knex) {

};

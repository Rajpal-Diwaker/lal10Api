
exports.up = function(knex) {
    return knex.schema
    .createTable('email_Enq_data', function(t) {
        t.increments('id').primary()
        t.string('messageId')
        t.string('fromEmail')
        t.text('header','longtext')
        t.text('body','longtext')
        t.timestamp('createdAt')
    })

    .alterTable('enquiries', function(t) {
        t.string('messageId')
        t.text('mailSubject','longtext').alter()
        t.text('mailBody','longtext').alter()
    })
};

exports.down = function(knex) {

};


exports.up = function(knex) {
    return knex.schema

    .createTable('adminBusiness', function(t) {
        t.increments('id').primary()
        t.string('companyEmail')
        t.string('companyNumber')
        t.string('companyAddress')
        t.string('instagram')
        t.string('facebook')
        t.string('twitter')
        t.integer('isActive').default(1)
        t.timestamp('createdAt')
    })

    .createTable('AdminWebToken', function(t) {
        t.increments('id').primary()
        t.integer('userId')
        t.string('webToken')
        t.integer('isActive').default(1)
        t.timestamp('createdAt')
    })

    .createTable('ourTeam', function(t) {
        t.increments('id').primary()
        t.string('name')
        t.string('designation')
        t.string('image')
        t.integer('isActive').default(1)
        t.timestamp('createdAt')
    })

};

exports.down = function(knex) {

};

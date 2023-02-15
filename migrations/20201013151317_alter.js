
exports.up = function(knex) {
    return knex.schema
    .alterTable('stories', function(t) {
        t.string('url')
    })

    .createTable('catalogue', function(t) {
        t.increments('id').primary()
        t.string('title')
        t.string('description')
        t.string('link')
        t.integer('isActive').default(1)
        t.timestamp('createdAt')
    })
};

exports.down = function(knex) {

};

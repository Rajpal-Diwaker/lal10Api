
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {id: 1, name: 'admin'},
        {id: 2, name: 'artisan'},
        {id: 3, name: 'enduser'},
        {id: 4, name: 'subadmin'}
      ]);
    });
};

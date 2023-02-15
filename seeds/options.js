
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('options').del()
    .then(function () {
      // Inserts seed entries
      return knex('options').insert([
        // { id: 1, name: 'english', type: 'language', isActive: 1,userId:1 },
        // { id: 2, name: 'hindi', type: 'language', isActive: 1,userId:1 },        
      ]);
    });
};

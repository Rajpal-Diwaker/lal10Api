
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('customer_important_sample').del()
    .then(function () {
      // Inserts seed entries
      return knex('customer_important_sample').insert([
        {id: 1, type: 'Home Made',icon:'Home'},
        {id: 2, type: 'Social Good',icon:'Thumb'},
        {id: 3, type: 'Made in India',icon:'India'},
        {id: 4, type: 'Made Locally',icon:'Location'},
        {id: 5, type: 'Eco-friendly',icon:'Hand'},
        {id: 6, type: 'Not Sold On Amazon',icon:'Amazon'},        
      ]);
    });
};

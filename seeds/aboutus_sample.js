
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('aboutus_sample').del()
    .then(function () {
      // Inserts seed entries
      return knex('aboutus_sample').insert([
        {id: 1, type: 'Email or referral link from a vendor or brand'},
        {id: 2, type: 'Google search'},
        {id: 3, type: 'Word of mouth (e.g.industry,friends,family)'},
        {id: 4, type: 'Industry websites/news outlets(e.g giftshopmag.com,nrf.com,forbes,wsj.com,etc.)'},
        {id: 5, type: 'Trade show or event'},
        {id: 6, type: 'Facebook'},
        {id: 7, type: 'Physical mail from Lal10 Store'},
        {id: 8, type: 'Instagram'},
        {id: 9, type: 'Other'}        
      ]);
    });
};

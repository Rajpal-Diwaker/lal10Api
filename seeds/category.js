
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('category').del()
    .then(function () {
      // Inserts seed entries
      return knex('category').insert([

        {id: 1, title:  '',parentId:'1',image:"test.png"},        
        {id: 2, title:  'Home & Living',parentId:'1',image:"test.jpg"},
        {id: 3, title:  'Food & Drink ',parentId:'1',image:"test.jpg"},
        {id: 4, title:  'Woman',parentId:'1',image:"test.jpg"},
        {id: 5, title:  'Beauty & Wellness',parentId:'1',image:"test.jpg"},
        {id: 6, title:  'Jewelery',parentId:'1',image:"test.jpg"},
        {id: 7, title:  'Paper & Novelty',parentId:'1',image:"test.jpg"},
        {id: 8, title:  'Kids & Baby',parentId:'1',image:"test.jpg"},
        {id: 9, title:  'Pets',parentId:'1',image:"test.jpg"},
        
        {id: 10, title: 'Trading Collections',parentId:'2', image:"test.jpg"},
        {id: 11, title: 'COVID-19 Resources',parentId:'2', image:"test.jpg"},
        {id: 12, title: 'Brand Values',parentId:'3', image:"test.jpg"},
        {id: 13, title: 'Recommended',parentId:'3', image:"test.jpg"},

        {id: 14, title: 'Shop ALL Home & Living',parentId:'4', image:"test.jpg"},
        {id: 15, title: 'Show New Arrivals',parentId:'4', image:"test.jpg"},

        {id: 16, title: 'Bath',parentId:'5', image:"test.jpg"},
        {id: 17, title: 'Bedding',parentId:'5', image:"test.jpg"},
        {id: 18, title: 'Candles & Holders',parentId:'6', image:"test.jpg"},
        {id: 19, title: 'Home Fragances',parentId:'6', image:"test.jpg"},
        
        {id: 20, title: 'Shop ALL Food & Drink',parentId:'7', image:"test.jpg"},
        {id: 21, title: 'Show New Arrivals',parentId:'7', image:"test.jpg"},

        {id: 22, title: 'Garden & Outdoor',parentId:'8', image:"test.jpg"},
        {id: 23, title: 'Home Accents',parentId:'8', image:"test.jpg"},
        {id: 24, title: 'Baking',parentId:'9', image:"test.jpg"},
        {id: 25, title: 'DIY Kits',parentId:'9', image:"test.jpg"},

      ]);
    });
};

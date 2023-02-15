
exports.seed = function(knex) {
  // Deletes ALL existing entries
  
return knex('type_of_store').del()
    .then(function () {      
      return knex('type_of_store').insert([
        {id: 1, name: 'Brick And Morter',icon:"Home",description:"Test",isActive:1},
        {id: 2, name: 'Pop-Up Shop',icon:"Car",description:"Pop-Up Shop",isActive:1},
        {id: 3, name: 'Online Only',icon:"Laptop",description:"Online Only",isActive:1},
        {id: 4, name: 'Others',icon:"Others",description:"Others",isActive:1},	
      ]);
    });
};


exports.up = function(knex) {
	 return knex.schema
    .alterTable("category", (t) => {
        t.dropColumn('isActive');
    })
    .alterTable("category", (t) => {        
        t.specificType('isActive', 'tinyint(1)').default(1)
        t.string('banner_image');   
    })

};

exports.down = function(knex) {
  
};

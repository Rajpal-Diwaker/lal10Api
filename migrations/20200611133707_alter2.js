
exports.up = function(knex) {
	  return knex.schema
	    .alterTable('category', function(t) {
	        t.string('image').notNull()	        
      		t.specificType('isActive', 'tinyint(1)');
	    });
};

exports.down = function(knex) {
  
};

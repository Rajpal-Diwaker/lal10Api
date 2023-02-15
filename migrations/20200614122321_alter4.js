
exports.up = function(knex) {
   return knex.schema
	    .alterTable('user_details', function(t) {
	        t.string('phone')	        
	        t.string('country')	              		
	    });
};

exports.down = function(knex) {
  
};

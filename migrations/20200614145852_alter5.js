
exports.up = function(knex) {
   return knex.schema
	    .alterTable('users', function(t) {	        
	        t.dropUnique('mobile')
	        t.dropUnique('email')	       
	    });
};

exports.down = function(knex) {
  
};

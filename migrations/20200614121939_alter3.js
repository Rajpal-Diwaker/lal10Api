
exports.up = function(knex) {
   return knex.schema
	    .alterTable('users', function(t) {
	        t.string('otp').notNull()	        
      		t.specificType('isOtpVerified', 'tinyint(1)');
	    });
};

exports.down = function(knex) {
  
};

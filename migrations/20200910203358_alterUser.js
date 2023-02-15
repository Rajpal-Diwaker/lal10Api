
exports.up = function(knex) {
    return knex.schema 

    .alterTable('users', function(t) {	  
        t.renameColumn('token', 'appToken')           
        t.string('webToken')
     })

     .alterTable('enquiry_order', function(t) {	          
        t.string('orderType').comment('1->DirectOrder ,0->IndirectOrder')
     })
};

exports.down = function(knex) {
  
};

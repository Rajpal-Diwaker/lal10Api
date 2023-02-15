
exports.up = function(knex) {
    return knex.schema        
        .alterTable('category', function(t) {
            t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->record deleted [soft delete]')
        })
        
        .alterTable('users', function(t) {
            t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->record deleted [soft delete]')
        })

        .alterTable('options', function(t) {
            t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->record deleted [soft delete]')
        })

        .alterTable('enquiries', function(t) {
            t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->record deleted [soft delete]')
        })

        .alterTable('products', function(t) {
            t.enum('deleted',['0','1']).default(1).comment('1->active record ,0->record deleted [soft delete]')
        })
       
};

exports.down = function(knex) {
  
};

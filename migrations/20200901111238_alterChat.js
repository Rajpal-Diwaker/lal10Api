
exports.up = async function(knex) {
    await knex.raw(`ALTER TABLE chat MODIFY COLUMN type ENUM('delete','text','image','logistic','invoice','tracker','purchase','estimate','comment','price','general','description')`)
    
    return knex.schema 
    .alterTable('chat', function(t) {	         
        t.string('comments').defaultTo('')
     })
     
};

exports.down = function(knex) {
  
};

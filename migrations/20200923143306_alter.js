
exports.up = function(knex) {
    return knex.schema 
   
    .alterTable('infographics', function(t) {	                         
        t.integer('totalCountries')            
        t.renameColumn('description','insdustry')   
    })

    .createTable('aboutUs', function(t) {	                         
        t.increments('id').primary()                
        t.string('title') 
        t.text('description')                
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

    .createTable('privacyPolicy', function(t) {	                         
        t.increments('id').primary() 
        t.string('title')                
        t.text('description')                
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

    .createTable('refundPolicy', function(t) {	                         
        t.increments('id').primary() 
        t.string('title')                
        t.text('description')                
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

    .createTable('carrer', function(t) {	                         
        t.increments('id').primary() 
        t.string('title')                
        t.text('description')                
        t.string('position') 
        t.integer('totalOpening') 
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

    .createTable('Resumes', function(t) {	                         
        t.increments('id').primary() 
        t.string('fullName')
        t.integer('mobile')                
        t.string('email')
        t.string('subject')     
        t.string('resume')                 
        t.text('description')          
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

    .createTable('blogs', function(t) {	                         
        t.increments('id').primary() 
        t.string('title')   
        t.string('link')        
        t.string('image')        
        t.text('description')          
        t.specificType('isActive','tinyint(3)').defaultTo(1)        
        t.timestamp('createdAt').defaultTo(knex.fn.now())   
    })

};

exports.down = function(knex) {
  
};

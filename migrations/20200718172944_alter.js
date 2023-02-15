
exports.up = function(knex) {
    return knex.schema        
    .alterTable('newsfeed', function(t) {
        t.enum('type',['web','app']).default('web').comment('web->for Websites,app->for App')
    })

    .alterTable('users', function(t) {
        t.enum('type',['email','lead','website']).comment('email->for email users,lead->for lead users enquiry,websites->for website enquiry user unregistred')
    })

    .alterTable('cms', function(t) {
        t.enum('viewType',['web','app']).default('web').comment('web->for Websites,app->for App')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
        t.enum('deleted', ['1','0']).defaultTo(1).comment('1->for active,0->Inactive')
    })
    
    .alterTable('onboarding', function(t) {
        t.enum('type',['web','app']).default('web').comment('web->for Websites,app->for App')
    })

    .alterTable('customer_important_sample', function(t) {
        t.string('country')
    })

    .alterTable('infographics', function(t) {
        t.string('totalClients')
        t.string('totalProject')
        t.string('description')
        t.string('type')
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
        t.enum('deleted', ['1','0']).defaultTo(1).comment('1->for active,0->Inactive')
    })

    .alterTable('infographics_states', function(t) {
        t.integer('info_id')       
        t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
        t.enum('deleted', ['1','0']).defaultTo(1).comment('1->for active,0->Inactive')
    })

    .alterTable('products', function(t) {
        t.enum('ideal', ['1','0']).defaultTo(1).comment('1->for ideal,0->Non ideal')
        t.enum('verified', ['1','0']).comment('1->for Accept,0->Reject')
    })

    .alterTable('enquiries', function(t) {
        t.integer('materialId')        
        t.string('requestTo')        
        t.string('update_status')                     
    })
    
};

// cms type==  About us,Patch-message,Testimonial,Faq,Banner,USP,Industries

exports.down = function(knex) {
  
};

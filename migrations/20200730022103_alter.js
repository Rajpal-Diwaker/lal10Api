
exports.up = function(knex) {
    return knex.schema        
    .alterTable('estimate', function(t) {        
        t.string('pdfUrl')        
    })

    .alterTable('invoice', function(t) {        
        t.string('pdfUrl')        
    })

    .alterTable('po', function(t) {        
        t.string('pdfUrl')        
    })  

    .alterTable('products', function(t) {        
        t.string('sku')        
    })

    .alterTable('enquiry_order', function(t) {        
        t.string('estimateUrl')
        t.string('poUrl')
        t.string('invoiceUrl')        
    })
};

exports.down = function(knex) {
  
};

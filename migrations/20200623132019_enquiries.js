
exports.up = function(knex) {
    return knex.schema
    .createTable("enquiries", (t) => {
      t.increments("id").primary()
      t.string('uniqueId')
      t.integer('productId').references('id').inTable('products').unsigned().onDelete('cascade')
      t.string('title')
      t.string('description')
      t.string('qty')
      t.string('expPrice')
      t.integer('userId').references('id').inTable('users').unsigned().onDelete('cascade')
      t.string('mailBy')
      t.string('mailSubject')
      t.string('mailBody')
      t.enum('isGenrate', ['0','1','2','3'] ).default(0).comment('0->not Assign,1->Assign open to all,2->Assign to particuler group)')
      t.integer('craftId','tinyint(1)')
      t.enum('typeOfEnquiry',['','1','2','3'] ).default('').comment('1->lead Enquiry,2->Email Enquiry,3->website Enquiry')
      t.enum('status',['0','1'] ).default(0).comment('0->open,1->close')
      t.timestamp("created_at").defaultTo(knex.fn.now())
      t.specificType('isActive', 'tinyint(1)').defaultTo(1).comment('1->for active,0->Inactive')
      t.datetime("updated_at")
    })
};

exports.down = function(knex) {

};

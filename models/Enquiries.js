const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Enquiries extends Model {
  static get tableName() {
    return 'enquiries';
  }
}

module.exports = Enquiries;
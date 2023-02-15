const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class CMS extends Model {
  static get tableName() {
    return 'cms';
  }
}

module.exports = CMS;
const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Store extends Model {
  static get tableName() {
    return 'store';
  }
}

module.exports = Store;
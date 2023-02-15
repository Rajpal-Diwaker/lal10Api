const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Shop extends Model {
  static get tableName() {
    return 'shop';
  }
}

module.exports = Shop;
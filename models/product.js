const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Product extends Model {
  static get tableName() {
    return 'products';
  }
}

module.exports = Product;
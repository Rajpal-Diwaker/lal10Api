const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class ProductImage extends Model {
  static get tableName() {
    return 'productImage';
  }
}

module.exports = ProductImage;
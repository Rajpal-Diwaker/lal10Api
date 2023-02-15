const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class UserProductSell extends Model {
  static get tableName() {
    return 'user_product_sell';
  }
}

module.exports = UserProductSell;
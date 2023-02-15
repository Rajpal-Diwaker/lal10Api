const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class CartRelation extends Model {
  static get tableName() {
    return 'cart_relation';
  }
}

module.exports = CartRelation;
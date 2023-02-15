const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Card extends Model {
  static get tableName() {
    return 'card';
  }
}

module.exports = Card;
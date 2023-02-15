const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class TypeOfStore extends Model {
  static get tableName() {
    return 'type_of_store';
  }
}

module.exports = TypeOfStore;
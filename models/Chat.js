const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Chat extends Model {
  static get tableName() {
    return 'chat';
  }
}

module.exports = Chat;
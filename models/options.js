const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Options extends Model {
  static get tableName() {
    return 'options';
  }
}

module.exports = Options;
const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Uploads extends Model {
  static get tableName() {
    return 'uploads';
  }
}

module.exports = Uploads;
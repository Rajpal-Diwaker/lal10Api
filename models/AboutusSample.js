const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class AboutusSample extends Model {
  static get tableName() {
    return 'aboutus_sample';
  }
}

module.exports = AboutusSample;
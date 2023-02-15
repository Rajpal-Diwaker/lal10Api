const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class SubType extends Model {
  static get tableName() {
    return 'sub_type';
  }
}

module.exports = SubType;
const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Submenu extends Model {
  static get tableName() {
    return 'submenu';
  }
}

module.exports = Submenu;
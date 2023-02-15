const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Menu extends Model {
  static get tableName() {
    return 'menu';
  }
}

module.exports = Menu;
const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Roles extends Model {
  static get tableName() {
    return 'roles';
  }
}

module.exports = Roles;
const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class UsersDetails extends Model {
  static get tableName() {
    return 'user_details';
  }
}

module.exports = UsersDetails;
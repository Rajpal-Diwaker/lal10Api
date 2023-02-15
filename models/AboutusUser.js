const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class AboutusUser extends Model {
  static get tableName() {
    return 'aboutus_user';
  }
}

module.exports = AboutusUser;
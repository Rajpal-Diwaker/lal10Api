const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Onboarding extends Model {
  static get tableName() {
    return 'onboarding';
  }
}

module.exports = Onboarding;
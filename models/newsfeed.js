const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Newsfeed extends Model {
  static get tableName() {
    return 'newsfeed';
  }
}

module.exports = Newsfeed;
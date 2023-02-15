const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class Artisan extends Model {
  static get tableName() {
    return 'artisan_details';
  }
}

module.exports = Artisan;
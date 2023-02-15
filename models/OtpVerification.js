const { Model } = require('objection');
const knex = require('../db/knex')

Model.knex(knex)

class OtpVerification extends Model {
  static get tableName() {
    return 'otp_verification';
  }
}

module.exports = OtpVerification;



// Update with your config settings.
module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: "localhost",
      user:  "root",
      password: "Techugo@123",
      database: "lal10",
      charset: 'utf8mb4',
      dbcollat: 'utf8mb4_unicode_ci'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      charset: 'utf8mb4',
      dbcollat: 'utf8mb4_unicode_ci'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4',
      dbcollat: 'utf8mb4_unicode_ci'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

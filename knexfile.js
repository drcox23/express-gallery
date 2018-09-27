// Update with your config settings.

// console.log('process.env', process.env)
// This console log helps with port mapping and seeing what's reading from your env

require('dotenv').config({path: './.env'})
// Gives knex migrations which is outside of the docker daemon access to our .env file
module.exports = {

  development: {
    client: 'pg',
    //postgres
    connection: {
      host: process.env.POSTGRES_HOSTNAME,
      // This is a network route - the name of the db
      port: process.env.POSTGRES_CONTAINER_PORT,
      // If part of the same network, they are a part of the same network so you use the container port
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD
    },
    migrations: {
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  },
  // database connection strings

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
      // Connection strings
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
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
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

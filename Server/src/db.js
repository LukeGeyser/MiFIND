const knex = require('knex');
const { Model } = require('objection');

const knexConfig = require('../knexfile');

const env = process.env.NODE_ENV || 'development';
const connectionString = knexConfig[env];

const connection = knex(connectionString);

Model.knex(connection);

module.exports = connection;
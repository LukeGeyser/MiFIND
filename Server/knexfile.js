require('dotenv').config();

module.exports = {
    development: {
        debug: false,
        client: 'mysql',
        connection: {
            host : process.env.DB_HOST,
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_NAME
        },
        migrations: {
            directory: './db/migrations'
        },
    },
    production: {
        debug: false,
        client: 'mysql',
        connection: {
            host : process.env.DB_HOST,
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_NAME
        },
        migrations: {
            directory: './db/migrations'
        },
    },
}
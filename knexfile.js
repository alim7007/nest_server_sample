require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: `${process.env.DB_DATABASE}`,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'db_migrations',
            directory: __dirname + '/dist/db/migrations',
        },
        seeds: {
            directory: __dirname + '/dist/db/seeds',
        },
    },

    staging: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: `${process.env.DB_DATABASE}`,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'db_migrations',
            directory: __dirname + '/dist/db/migrations',
        },
        seeds: {
            directory: __dirname + '/dist/db/seeds',
        },
    },

    test: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: `${process.env.DB_DATABASE}`,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'db_migrations',
            directory: __dirname + '/dist/db/migrations',
        },
        seeds: {
            directory: __dirname + '/dist/db/seeds',
        },
    },

    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: `${process.env.DB_DATABASE}_prod`,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'db_migrations',
            directory: __dirname + '/dist/db/migrations',
        },
        seeds: {
            directory: __dirname + '/dist/db/seeds',
        },
    },

    make: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: `${process.env.DB_DATABASE}`,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'db_migrations',
            directory: __dirname + '/src/db/migrations',
        },
        seeds: {
            directory: __dirname + '/src/db/seeds',
        },
    },
};

module.exports = config[env];

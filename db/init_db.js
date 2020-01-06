const database_config = require('../config/database_config')

const migrator = require('postgres-migrations')
const path = require('path')
const client = require('./client')


module.exports = () => {
    migrator.createDb(process.env.POSTGRES_DATABASE, database_config)
        .then(() => {
            client.connect()
            return migrator.migrate(database_config, path.resolve(__dirname, 'migrations'))
        })
        .then(() => {
            console.log("Migrations successful")
        })
        .catch(error => {
            console.log("Database migrations failed")
            console.log(error)

            client.disconnect()
        })
}

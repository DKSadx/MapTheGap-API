const migrator = require('postgres-migrations')
const path = require('path')
const client = require('./client').client


module.exports = async () => {
    db_config = {}

    client.connect()
        .then(() => {
            db_config = {
                user: client.user,
                password: client.password,
                host: client.host,
                port: client.port,
                database: client.database,
                defaultDatabase: process.env.POSTGRES_DATABASE, 
            }
            console.log("djes2")
            return migrator.migrate(db_config, path.resolve(__dirname, 'migrations'))
        })
        .then(() => {
            console.log("djes3")
            console.log("Migrations successful")
        })
        .catch(error => {
            console.log("Database migrations failed")
            console.log(error)
            

            client.disconnect()
        })
}

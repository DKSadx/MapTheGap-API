const database_config = require('../config/database_config')
const { Client } = require('pg')

const client = new Client(database_config)

function connect() {
    client.connect().then(() => {
        console.log("Database connected")
    })
}

function disconnect() {
    client.end()
        .then(() => {
            console.log("Database disconnected")
        })
        .catch(error => {
            console.log("Failed to end connection", error)
        })
}
module.exports = {
    client: client,
    connect: connect,
    disconnect: disconnect
}

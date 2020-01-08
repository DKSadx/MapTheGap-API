const { Client } = require('pg')

const client = new Client(process.env.DATABASE_URL)

function connect() {
    return client.connect()
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

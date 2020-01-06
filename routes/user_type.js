const express = require('express')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client

//Endpoints
router.get('/', (req, res) => {
    client.query('SELECT * FROM user_types').then(result => {
        if (result.rows) {
            res.status(200).send({
                success: true, 
                request_id: Math.random().toString(36).substring(3),
    
                data: {
                    issue: result.rows
                }
            })
        } else throw {detail: "Table is empty"}
    }).catch(error => {
        //Error
        console.log(error)
        res.status(400).send({
            success: false,
            request_id: Math.random().toString(36).substring(3),

            data: {},

            error: {
                message: error.detail,
                code: error.code
            }
        })
    })
})

router.get('/:id', (req, res) => {
    client.query(`SELECT * FROM user_types WHERE id=${req.params.id}`).then(result => {
        if (result.rows) {
            res.status(200).send({
                success: true, 
                request_id: Math.random().toString(36).substring(3),
    
                data: {
                    issue: result.rows
                }
            })
        } else throw {detail: "Id does not exist"}
    }).catch(error => {
        //Error
        console.log(error)
        res.status(400).send({
            success: false,
            request_id: Math.random().toString(36).substring(3),

            data: {},

            error: {
                message: error.detail,
                code: error.code
            }
        })
    })
})

//Export
module.exports = router
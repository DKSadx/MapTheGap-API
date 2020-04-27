const express = require('express')
const check_user_access_token = require('../middleware/check_user_access_token')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client

//Endpoints
router.get('/', check_user_access_token, (req, res) => {

    Promise.all([
        client.query(`SELECT * FROM user_notifications(${req.userId}, FALSE)`),
        client.query(`SELECT * FROM user_notifications(${req.userId}, TRUE)`)
    ]).then(result => {
        console.log(result)
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {
                unread_notifications: result[1].rows,
                all_notifications: result[0].rows
            }
        })
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
    
router.put('/', check_user_access_token, (req, res) => {
    client.query(`SELECT * FROM read_notifications(${req.userId})`).then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {}
        })
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
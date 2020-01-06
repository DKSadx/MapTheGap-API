const express = require('express')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client



//Endpoints
router.get('/', (req, res) => {
    client.query(`SELECT * FROM areas`)
        .then(result => {
            if (result.rows[0]) {
                res.status(200).send({
                    success: true, 
                    request_id: Math.random().toString(36).substring(3),
    
                    data: result.rows
                })
            } else {
                throw {detail: "No areas found"}
            }
        }).catch(error => {
            //Error
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
    client.query(`SELECT * FROM areas WHERE id=${req.params.id}`)
        .then(result => {
            if (result.rows[0]) {
                res.status(200).send({
                    success: true, 
                    request_id: Math.random().toString(36).substring(3),
    
                    data: result.rows[0]
                })
            } else {
                throw {detail: "Area not found"}
            }
        }).catch(error => {
            //Error
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
const express = require('express')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client

//Endpoints
router.get('/', (req, res) => {
    client.query(`SELECT * FROM user_notifications(${req.params.id}, FALSE)`).then(result => {
        console.log(result)
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {
                unread_notifications: undefined
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
/*

    Promise.all(
        client.query(`SELECT * FROM user_notifications(${req.params.id}, FALSE)`),
        client.query(`SELECT * FROM user_notifications(${req.params.id}, TRUE)`)
    ).then(result => {
        console.log(result)
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {
                unread_notifications: undefined
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
    })*/
})
    
router.put('/', (req, res) => {
    client.query(`SELECT * FROM read_notifications(${req.params.id})`).then(result => {
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
//Functions
const validateUser = data => {
    //Definition check
    if (data.user_type == undefined) throw { detail: "'user_type' is undefined" }
    if (data.name == undefined) throw { detail: "'name' is undefined"}
    if (data.email == undefined) throw { detail: "'email' is undefined"}
    if (data.phone_number == undefined) throw { detail: "'phone_number' is undefined"}
    if (data.password == undefined) throw { detail: "'password' is undefined"}

    //Lenght check
    if (data.name.length > 63) throw { detail: "'name' needs to be shorter then 63 characters"}
    if (data.email.length > 255) throw { detail: "'email' needs to be shorter then 255 characters"}
    if (data.address.length > 255) throw { detail: "'address' needs to be shorter then 255 characters"}
    if (data.password.length > 63 || data.password.length < 8) throw { detail: "'password' needs to be shorter then 63 characters and longer then 7 characters"}
    if (data.company_type != undefined && data.company_type.length > 255) throw { detail: "'company_type' needs to be shorter then 255 characters"}
    if (data.areas) data.areaOfAction.forEach((element, index) => {
        if (element.length > 255) throw { detail: `'areas[${index}]' needs to be shorter then 255 characters`}
    });
    if (data.categories) data.categories.forEach((element, index) => {
        if (element.length > 255) throw { detail: `'categories[${index}]' needs to be shorter then 255 characters`}
    });

    //Validate Email
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(data.email)) throw { detail: "'email' is invalid"}

    //Validate phone number
    if (!/^\+[0-9]{5,15}$/
        .test(data.phone_number)) throw { detail: "'phone_number' is invalid"}

    //Validate date of birth
    if (data.dateOfBirth != null && !/^(?:(?:[13579][26]00|[02468][048]00|\d\d(?:0[48]|[2468][048]|[13579][26]))-(?:02-(?:0[1-9]|[12]\d)|(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30))|\d{4}-(?:02-(?:0[1-9]|1\d|2[0-8])|(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)))$/
        .test(data.date_of_birth)) throw { detail: "'date_of_birth' is invalid"}
}


//Export
module.exports = router
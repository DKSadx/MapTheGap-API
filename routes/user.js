const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client

//Endpoints
router.post('/login', async (req, res) => {
    client.query(
        `SELECT * FROM Users WHERE email='${req.body.email}'`
    ).then(async result => {
        if (result.rows[0] == undefined) throw {detail: "User does not exist"}

        //Check password
        if (await bcrypt.compare(req.body.password, result.rows[0].password)) {
            //Delete password
            result.rows[0].password = undefined

            //Response
            res.status(200).send({
                success: true,
                request_id: Math.random().toString(36).substring(3),
    
                data: {
                    token: await jwt.sign({id: result.rows[0].id}, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_EXPIRATION_TIME}),
                    user: result.rows[0]
                }
            })
        } else {
            //Incorrect password
            res.status(400).send({
                success: false,
                request_id: Math.random().toString(36).substring(3),
    
                data: {},
                error: {
                    message: "Incorrect email or password."
                }
            })
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

router.post('/register', async (req, res) => {
    try {
        //Validation
        validateUser(req.body)
        
        //Passsword hashing
        req.body.password = await bcrypt.hash(req.body.password, 10);
        
        //Save to DB
        var sqlData = await client.query(`SELECT * FROM create_user (
            ${req.body.user_type},
            ${req.body.name ? `'${req.body.name}'` : null},
            ${req.body.email ? `'${req.body.email}'` : null},
            ${req.body.phone_number ? `'${req.body.phone_number}'` : null},
            ${req.body.address ? `'${req.body.address}'` : null},
            ${req.body.date_of_birth ? `'${req.body.date_of_birth}'` : null},
            ${req.body.password ? `'${req.body.password}'` : null},
            ${req.body.company_type ? `'${req.body.company_type}'` : null},
            ${req.body.categories ? `'{${req.body.categories}}'` : null},
            ${req.body.areas? `'{${req.body.areas}}'` : null}
        );`)


        //Response
        res.status(200).send({
            success: true,
            request_id: Math.random().toString(36).substring(10),

            data: {
                token: await jwt.sign({id: sqlData.rows[0].id}, process.env.JWT_KEY, {expiresIn: process.env.TOKEN_EXPIRATION_TIME}),
                user: sqlData.rows[0]
            }
        })

        
    } catch (error) {
        console.log(error)
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
    }
})

router.get('/:id', (req, res) => {
    var sqlCommand = ""
    
    if (req.userId == req.params.id) {
        sqlCommand = `SELECT id, user_type, name, email, phone_number, address, date_of_birth, avatar, company_type FROM users WHERE id=${req.params.id}`
    } else {
        sqlCommand = `SELECT id, user_type, name, avatar, company_type FROM users WHERE id=${req.params.id}`
    }
    
    //Execute query
    client.query(sqlCommand).then(result => {
        //Remove null columns
        Object.keys(result.rows[0]).forEach(element => {
            if (result.rows[0][element] == null) result.rows[0][element] = undefined
        })

        //Response
        res.status(200).send({
            success: true,
            request_id: Math.random().toString(36).substring(3),

            data: {
                user: result.rows[0]
            },
        })
    }).catch(error => {
        //Error
        res.status(400).send({
            success: false,
            request_id: Math.random().toString(36).substring(3),

            data: {},
            error: {
                message: error.detail
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
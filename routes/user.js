const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const check_user_access_token = require('../middleware/check_user_access_token')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client

//Node Mailer
transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

//Endpoints
router.post('/login', async (req, res) => {
    client.query(
        `SELECT * FROM Users WHERE email='${req.body.email}'`
    ).then(async result => {
        if (result.rows[0] == undefined) throw {detail: "User does not exist"}
        if (!result.rows[0].verified) throw {detail: "User is not verified"}

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
    let r = Math.random().toString(36).substring(2);
    
    try {
        //Validation
        validateUser(req.body)
        
        //Passsword hashing
        req.body.password = await bcrypt.hash(req.body.password, 10);
        

        //Get contry from address
        if (!req.body.country) {
            if (req.body.address.indexOf('Bosnia and Herzegovina') != -1) req.body.country = 'Bosnia and Herzegovina'
            if (req.body.address.indexOf('Rep. North Macedonia') != -1) req.body.country = 'Rep. North Macedonia'
            if (req.body.address.indexOf('Serbia') != -1) req.body.country = 'Serbia'
            if (req.body.address.indexOf('Poland') != -1) req.body.country = 'Poland'
            if (req.body.address.indexOf('Slovenia') != -1) req.body.country = 'Slovenia'
            if (req.body.address.indexOf('Italy') != -1) req.body.country = 'Italy'
            if (req.body.address.indexOf('Turkey') != -1) req.body.country = 'Turkey'  
        }
        
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
            ${req.body.areas? `'{${req.body.areas}}'` : null},
            ${req.body.country? `'${req.body.country}'` : null},
            ${req.body.user_type == 4}
        );`)

        if (req.body.user_type != 4) {
            console.log("djes")
            verification_id = await client.query(`INSERT INTO user_verification(id, user_id) VALUES ('${crypto.randomBytes(15).toString('hex')}', ${sqlData.rows[0].id}) RETURNING id`)

            transporter.sendMail({
                from: process.env.MAIL_USER,
                to: req.body.email,
                subject: "MTG - Verify email", 
                html: `Click <a href="http://${req.get('host') + '/user/verify/' + verification_id.rows[0].id}">here</a> to verify your e-mail address.`, 
            });

        }

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

router.get('/:id', check_user_access_token, (req, res) => {
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

router.get('/verify/:id', (req, res) => {
    client.query(`SELECT verify_user('${req.params.id}')`)
        .then(result => {
            //Response
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
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(data.email)) throw { detail: "'email' is invalid"}

    if (data.user_type == 4 && data.email.indexOf('gov') < data.email.indexOf('@')) throw { detail: "'email' is invalid"}

    //Validate phone number
    if (!/^[\+0-9][0-9]{5,20}/.test(data.phone_number)) throw { detail: "'phone_number' is invalid"}

    //Validate date of birth
    if (data.dateOfBirth != null && !/^(?:(?:[13579][26]00|[02468][048]00|\d\d(?:0[48]|[2468][048]|[13579][26]))-(?:02-(?:0[1-9]|[12]\d)|(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30))|\d{4}-(?:02-(?:0[1-9]|1\d|2[0-8])|(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)))$/
        .test(data.date_of_birth)) throw { detail: "'date_of_birth' is invalid"}
}


//Export
module.exports = router
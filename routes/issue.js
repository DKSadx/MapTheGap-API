const express = require('express')

const router = express.Router()

//Postgres connection
const client = require('../db/client').client


//Endpoints
router.get('/:id', (req, res) => {
    client.query(`SELECT * FROM detailed_issue(${req.params.id}, ${req.userId}) d`).then(result => {
        if (result.rows) {
            res.status(200).send({
                success: true, 
                request_id: Math.random().toString(36).substring(3),
    
                data: {
                    issue: result.rows[0]
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

router.post('/', (req, res) => {
    client.query(`SELECT * FROM create_issue(
        ${req.body.title ? `'${req.body.title}'` : null},
        ${req.body.short_description ? `'${req.body.short_description}'` : null},
        ${req.body.detailed_description ? `'${req.body.detailed_description}'` : null},
        ${req.body.proposed_solution ? `'${req.body.proposed_solution}'` : null},
        ${req.body.images ? `'{${req.body.images}}'` : null},
        ${req.body.participate ? `'${req.body.participate}'` : null},
        ${req.body.categories ? `'{${req.body.categories}'}` : null},
        ${req.body.delegate_to ? `${req.body.delegate_to}` : null},
        ${req.userId ? `'${req.userId}'` : null},
        ${req.body.location.coordinates[0] ? `${req.body.location.coordinates[0]}` : null},
        ${req.body.location.coordinates[1] ? `${req.body.location.coordinates[1]}` : null}
    )`).then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {
                issue: result.rows[0]
            }
        })
    }).catch(error => {
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
    })
})

router.put('/:id', (req, res, next) => {
    client.query(
        `SELECT created_by FROM issue WHERE id=${req.params.id}`
    ).then(result => {
        if (result.rows[0]) {
            if (result.rows[0].created_by == req.userId) {
                next()
            } else {
                throw {detail: "Access denied"}
            }
        } else {
            throw {detail: "Issue doesn't exist"}
        }
    })
}, (req, res) => {
    client.query(`SELECT * FROM update_issue(
        ${req.params.id},
        ${req.body.title ? `'${req.body.title}'` : null},
        ${req.body.short_description ? `'${req.body.short_description}'` : null},
        ${req.body.detailed_description ? `'${req.body.detailed_description}'` : null},
        ${req.body.proposed_solution ? `'${req.body.proposed_solution}'` : null},
        ${req.body.images ? `'{${req.body.images}}'` : null},
        ${req.body.participate ? `${req.body.participate}` : null},
        ${req.body.categories ? `'{${req.body.categories}'}` : null},
        ${req.body.delegate_to ? `${req.body.delegate_to}` : null},
        ${req.body.location.coordinates[0] ? `${req.body.location.coordinates[0]}` : null},
        ${req.body.location.coordinates[1] ? `${req.body.location.coordinates[1]}` : null}
    )`).then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {
                issue: result.rows[0]
            }
        })
    }).catch(error => {
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
    })
})

router.delete('/:id', (req, res, next) => {
    client.query(
        `SELECT created_by FROM issues WHERE id=${req.params.id}`
    ).then(result => {
        if (result.rows[0]) {
            if (result.rows[0].created_by == req.userId) {
                next()
            } else {
                throw {detail: "Access denied"}
            }
        } else {
            throw {detail: "Issue doesn't exist"}
        }
    }).catch(error => {
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
}, (req, res) => {
    client.query(`SELECT delete_issue(${req.params.id})`)
        .then(result => {
            res.status(200).send({
                success: true, 
                request_id: Math.random().toString(36).substring(3),

                data: {}
            })
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

router.post('/:id/upvote', (req, res) => {
    client.query(`SELECT vote(${req.userId}, ${req.params.id}, TRUE)`)
    .then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {}
        })
    }).catch(error => {
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
    })
})

router.delete('/:id/upvote', (req, res) => {
    client.query(`SELECT vote(${req.userId}, ${req.params.id}, FALSE)`)
    .then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {}
        })
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

router.post('/:id/support', (req, res) => {
    console.log("djes")
    client.query(`SELECT support_issue(${req.userId}, ${req.params.id}, TRUE)`)
    .then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {}
        })
    }).catch(error => {
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
    })
})

router.delete('/:id/support', (req, res) => {
    client.query(`SELECT issue_support(${req.userId}, ${req.params.id}, FALSE)`)
    .then(result => {
        res.status(200).send({
            success: true, 
            request_id: Math.random().toString(36).substring(3),

            data: {}
        })
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
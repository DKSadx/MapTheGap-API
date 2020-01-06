const express = require("express");
const cloudinary = require("cloudinary");
const router = express.Router();

//Postgres connection
const client = require("../db/client").client;

//Endpoints
router.post("/", (req, res) => {
    const values = Object.values(req.files)
    const promises = values.map(image => cloudinary.uploader.upload(image.path))

    Promise.all(promises)
        .then(response => {
            console.log(response);

            res.status(200).send({
                success: true,
                request_id: Math.random().toString(36).substring(3),

                data: response
            })
        })
        .catch(error => {
            console.log(error);

            res.status(500).send({
                success: false,
                request_id: Math.random().toString(36).substring(3),

                data: {},
                error: {
                    message: error.detail,
                    code: error.code
                }
            });
        })
});
//Export
module.exports = router;
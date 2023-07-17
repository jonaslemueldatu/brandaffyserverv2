const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const affiliateProfile = require('../models/affiliateProfile')

router.get('/', (req, res) => {
    const params = req.query
    affiliateProfile.find(params, '_id profile_picture first_name last_name email gender age province logged_in province').then((data) => {
        if (data) {
            res.status(200)
            res.json({
                msg: "Successfully pulled list of affiliates",
                affiliate_list: data
            })
        }
    })
})

module.exports = router
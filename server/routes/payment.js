const express = require('express');
const router = express.Router();
const { Payment } = require("../models/Payment");
const multer = require('multer');
const { auth } = require("../middleware/auth");


router.post("/getPayments", (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let findArgs = {};
    let term = req.body.searchTerm;


    console.log(Payment)
    if (term) {
        Payment.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, payments) => {
                console.log(err)
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, payments })
            })
    } else {

        Payment.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, payments) => {
               // console.log(users[0].history[0]);
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, payments })
            })
    }
});

module.exports = router;
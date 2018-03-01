const express = require('express')
const router = express.Router()
const config = require('../config/config')

const last = require('../models/last')
const checkTime = require('../util/perfomance')

router.get('/', (req, res) => {
    checkTime(last.initDb)
        .then(() => res.json({k: 'ok'}))
        .catch(err => console.log(err))
})

router.get('/new', (req, res) => {
    Promise.all([
        checkTime(last.loadLast),
        checkTime(last.loadBest)
    ])
        .then(amounts => {
            res.json({
                last: amounts[0],
                best:amounts[1]
            })
        })
        .catch(err => {
            console.log('err: ', err)
            res.json(err)
        })
})
//
// router.get('/test', (req, res) => {
//     setTimeout(() => res.json({a:1}), 1000*60*2)
// })

module.exports = router

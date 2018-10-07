const router = module.exports = require('express').Router()
const {IsAuthenticated,JWT} = require(`${__base}/utils/user`)
const cors = require('cors')

var corsOptions = {
    credentials: true
}
router.use((req, res, next) => {
    corsOptions['origin'] = req.get('origin')
    next()
}, cors(corsOptions))


router.post('/login', (req, res) => {
    const {username,password} = req.body
    if (!(username) || !(password)) {
        res.status(400).json({
            'message': 'Please Kindly enter correct password and username'
        })
    } else {
        const token = JWT(username)
        res.status(200).json({
            'message': 'User login successful',
            'token': token
        })
    }
})


router.post('/path', IsAuthenticated, (req, res) => {
    res.status(200).json({
        'message': 'router for JSON patch'
    })
})

router.post('/thumbnail', IsAuthenticated, (req, res) => {
    res.status(200).json({
        'message': 'router for thumbnail'
    })
})
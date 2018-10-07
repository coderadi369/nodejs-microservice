const router = module.exports = require('express').Router()
const {IsAuthenticated,JWT} = require(`${__base}/utils/user`)
const cors = require('cors')
const jsonpatch=require('json-patch')

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


router.post('/patch', IsAuthenticated, (req, res) => {
    const {body,patch}=req.body
    if(!(body) || !(patch)){
    	res.status(400).json({'message':'Both body and patch are required fields'})
    }else{
    	const result=jsonpatch.apply(body,patch)
    	res.status(200).json(result)
    }
})

router.post('/thumbnail', IsAuthenticated, (req, res) => {
    res.status(200).json({
        'message': 'router for thumbnail'
    })
})
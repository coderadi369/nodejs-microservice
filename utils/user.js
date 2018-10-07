const jwt = require('jsonwebtoken')
const {
    config
} = require(`${__base}/utils/config`)

function IsAuthenticated(req, res, next) {
    const token = req.body.token || req.headers.token
    if (!(token)) {
        res.status(400).json({
            'status': 'You are not authorized to view this page'
        })
    } else {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.status(400).json({
                    'status': 'You are not authorized to view this page'
                })
            } else {
                next()
            }
        })
    }
    
}

function JWT(username) {
    const JWTToken = jwt.sign({
        name: username,
    }, config.secret, {
        expiresIn: '2h'
    });
    return JWTToken
}
module.exports = {
    IsAuthenticated,
    JWT
}
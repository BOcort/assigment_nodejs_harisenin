const jwt = require('jsonwebtoken')
const {userNew} = require('../models')


const verifyToken = async (req,res ,next) => {
    try {
        const jwt_token = req.headers['authorization']

        if (!jwt_token) {
            return res.status(400).send({
                message: 'No Token Provided'
            })
        }

        const verify = jwt.verify(jwt_token.split(" ")[1],process.env.JWT_SECRET)
        if (!verify) {
            return res.status(403).send({
                message:"failed to autorization"
            })
        }

        req.user = verify
        next()
    } catch (error) {
        return res.send({
            message: 'error',
            data:error
        })
    }
}


module.exports = {verifyToken}
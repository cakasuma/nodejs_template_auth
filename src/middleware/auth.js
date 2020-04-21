const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        const user = await userModel.findOne({ _id: data._id, 'tokens.token': token })
        console.log(user)
        if (!user) {
            throw new Error('No user found')
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth
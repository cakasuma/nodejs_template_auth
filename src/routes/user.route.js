const express = require('express')
const User = require('../controllers/user.controller')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/user/register', User.register)

router.post('/user/login', User.login)

// pass middleware auth to check this is route is only for logged in user
router.get('/user/profile', auth, User.getUserProfile)

router.post('/user/logout', auth, User.logout)

router.post('/user/logoutall', auth, User.logoutAll)

module.exports = router
const userModel = require('../models/user.model')

const User = (() => {
    const register = async (req, res) => {
        // Create a new user
        try {
            console.log('some here')
            const user = new userModel(req.body)
            console.log('presave')
            await user.save()
            console.log(user)
            const token = await user.generateAuthToken()
            console.log(token)
            res.status(201).send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    }

    const login = async (req, res) => {
        // Login a registered user
        try {
            const { email, password } = req.body
            const user = await userModel.findByCredentials(email, password)
            if (!user) {
                return res.status(401).send({error: 'Login failed! Check your credentials'})
            }
            const token = await user.generateAuthToken()
            res.send({ user, token })
        } catch (error) {
            res.status(400).send(error)
        }
    }

    const getUserProfile = async (req, res) => {
        // Get user profile
        res.send(req.user)
    }

    const logout = async (req, res) => {
        // Log user out of the application
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token != req.token
            })
            await req.user.save()
            res.status(201).send('logout successfully')
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const logoutAll = async (req, res) => {
        // Log user out of all devices
        try {
            req.user.tokens.splice(0, req.user.tokens.length)
            await req.user.save()
            res.status(201).send('logout all device successfully')
        } catch (error) {
            res.status(500).send(error)
        }
    }

    const userEdit = async (req, res) => {
        if (!req.body) res.status(500).send('Missing request body')

        // Edit user login credentials
        if (req.body.email) req.user.email = req.body.email;
        if (req.body.password) req.user.password = req.body.password;
        
        // Edit user account information
        if (req.body.generate_new_photo) req.user.photo = req.user.generatePhoto();
        if (req.body.first_name) req.user.first_name = req.body.first_name;
        if (req.body.last_name) req.user.last_name = req.body.last_name;
        if (req.body.address_line_1) req.user.address_line1 = req.body.address_line_1;
        if (req.body.address_line_2) req.user.address_line2 = req.body.address_line_2;
        if (req.body.country_code) req.user.country_code = req.body.country_code;
        if (req.body.postal_code) req.user.postal_code = req.body.postal_code;
        if (req.body.phone) req.user.phone = req.body.phone;
        
        req.user.save(function(error) {
            if (err) return res.status(500).send(error);

            res.status(201).send(user)
        });
    }

    return {
        register,
        login,
        getUserProfile,
        logout,
        logoutAll,
        userEdit
    }
})()

module.exports = User
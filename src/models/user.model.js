const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
var crypto = require('crypto');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        validate: value => {
            if (validator.isEmpty(value)) throw new Error({error: 'name is empty'})
        }
    },
    last_name: {
        type: String,
        default: '',
        trim: true,
    },
    photo: {
        type: String,
        default: 'https://via.placeholder.com/150x150'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            // add validation from validator, read more here https://www.npmjs.com/package/validator
            if (!validator.isEmail(value)) throw new Error({error: 'Invalid Email address'})
            if (validator.isEmpty(value)) throw new Error({error: 'Email address is empty'})
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate: value => {
            if (validator.isEmpty(value)) throw new Error({error: 'password is empty'})
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
            validate: value => {
                if (validator.isEmpty(value)) throw new Error({error: 'token is empty'})
            }
        }
    }],
    address_line_1: { type: String, default: '', },
    address_line_2: { type: String, default: '', },
    country_code: { type: String, default: '', },
    postal_code: { type: String, default: '', },
    phone: { type: String, default: '', },
})

userSchema.pre('save', async function (req, res, next) {
    console.log('saving')
    // Hash the password before saving the user model
    const user = this

    if (user.isModified('password')) {
        console.log('password modified')
        user.password = await bcrypt.hash(user.password, 8)
    }
    console.log('going to next')
    next()
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

/* Signup - generate user photo using Gravatar API */
userSchema.methods.generatePhoto = function() {
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=150&d=wavatar';
};

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./../models/task')


const UserSchema  = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength:6,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type:Number,
        default:0,
        validate(value) {
            if(value<0) {
                throw new Error('Age must be postive number')
            }
        }
    }, 
    avatar: {
        type: Buffer
        // type: String, maxLenght: 255
    },
    tokens: [{
        token: {
            type: String,
            required:true
        }
    }]
    
   
}, {
    timestamps: true
})

UserSchema.virtual('tasks',{
    ref: 'tasks',
    localField:'_id', 
    foreignField:'owner'
})

// public profile
UserSchema.methods.toJSON = function() { 
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens    
    // delete userObject.avatar

    return userObject
}


// JWT
UserSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.ACCESS_TOKEN_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
   
    return token
}

// login
UserSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
     
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user

}


// hash password create, update
UserSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// Delete task when delete user
UserSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})



const User = mongoose.model('users',UserSchema)

module.exports = User



const mongoose = require('mongoose')
const validator = require('validator')
const Post = require('./post')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const userSchema = new mongoose.Schema({
    _id:{
        type:Number,
        AutoIncrement:true,
        primaryKey:true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    }, age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be greater than 18')
            }
        }
    },
    phone: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Wrong Phone Number')
            }
        }
    }
    ,
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }
});

userSchema.virtual('post',{
    ref:'Post',
    localField:'_id',
    foreignField:'owner'
}) 

userSchema.plugin(AutoIncrement, {inc_field: '_id'});




////Delete tasks when user is deleted//////
userSchema.pre('remove', async function (next) {
    const user = this
    await Post.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
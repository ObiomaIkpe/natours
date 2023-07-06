const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, ' Please tell us your name!']

    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        unique: true,
        lowercase: true,
        //validate: [validator.isEmail, 'Please provide an email address']
    },
    photo:{
        type: String,
    },

    active:{
        type: Boolean,
        default: true,
        select: false
    },

    role:{
        type:String,
        enum: ['user', 'tour-guide', 'lead-tour-guide', 'admin'],
        default: 'user'
        }

    ,
    password:{
        type: String,
        required: [true, 'please provide a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            //this works only when we save the object
            validator: function(el){
                return el === this.password;
            },
            message: 'passwords are not the same!'
        }
    },

     passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,

    
    
})

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)    
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    if(this.password) {const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    this.passwordConfirm = undefined
    }
    next()
})

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
          );
      console.log(changedTimestamp, JWTTimestamp)         
    
    return JWTTimestamp < changedTimestamp
        }
        return false;
}


userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken).digest('hex');

    //console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpiresIn = Date.now() + (10 * 60 * 1000);

    return resetToken;
}

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() - 1000;
    next()
})
userSchema.pre('/^find', function(next){
    //this points to the current query
    this.find({active: {$ne: false}})
    next()
})


module.exports = new mongoose.model('User', userSchema)
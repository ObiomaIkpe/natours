const crypto = require('crypto');
const User =  require('../models/usersModel')
const {StatusCodes} = require('http-status-codes')
const {badRequestError, unauthenticatedError, notFoundError, customAPIError} = require('../errors')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/email')



const signToken = userId => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    //remove password from response object...
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
          user
    }
    })
}


const signUp = async (req, res) => {
    

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm        
        //passwordChangedAt: req.body.passwordChangedAt
    });
    createSendToken(newUser, StatusCodes.CREATED, res);
      
 }

const login = async (req, res) => {
   const {email, password} = req.body

    //1) check if email and password exists in the user's input
    if (!email || !password){
        throw new badRequestError('invalid credentials')
    }

    const user = await User.findOne({email}).select('+password')
    //console.log(user)

    if (!user || !(await user.comparePassword(password, user.password))){
        throw new badRequestError('invalid credentials')
    }   

    createSendToken(user, StatusCodes.OK, res);
}

const protect = async (req, res, next) => {
    //get the token || check if the token exits
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new unauthenticatedError('invalid auth token')
    }

    const token = authHeader.split(' ')[1]
    if(!token){
        throw new unauthenticatedError('invalid auth token')
    }

   //console.log(token)


    let payload;
     //verify if the token is valid
    try{
         payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach the user to job routes
        
        console.log(payload)
         //req.user = {userId:payload.userId, name:payload.name}
    }catch(error){
        console.log(error)
    }    
    //check if user exists

    const currentUser = await User.findById(payload.userId)
    if(!currentUser){
        throw new notFoundError('no user with this token.')
    }

    //check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(payload.iat)){
        throw new unauthenticatedError('Password was recently changed, please log in again')
    }
    

    //Grant access to protected route
    //req.user = {userId:payload.userId, name:payload.name}
    req.user = currentUser
    //console.log(currentUser)

    next()

}


//restricting certain routes
const restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles ['admin', 'lead-guide']
        if(!roles.includes(req.user.role)){
            throw new customAPIError('you are not permitted to access this route', 403)
        }
        next()
    }

}

const forgotPassword = async (req, res, next) => {
    //1) get user based on POSTed email
    
    const user = await User.findOne({email: req.body.email})



    if(!user){
        throw new notFoundError('No user found with that email')
    }

    //generate random reset token
    const resestToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    //3) send it to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resestToken}`

    const message = `forgot your password? submit a PATCH request with your new password to ${resetURL}\n. If you didn't forget your password, please ignore this email!`
try{
    await sendEmail({
        email: req.body.email, //or user.email
        subject: 'Your password reset token (valid for 10 min)',
        message: message
    })

    res.status(StatusCodes.OK).json({
        message: 'Token sent to email'
    })

    
}
catch(err){
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});

    // throw new customAPIError('Error occurred while trying to send the email, please try again later!', 500)
    console.log(err)
} }

const resetPassword = async (req, res) => {
    //1) get user based on the token
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpiresIn: {$gt: Date.now() } })


    //2) if token has expired, and there is no user
    if(!user){
        throw new badRequestError('Token is invalid or has expired')
    }


    user.password = req.body.password;
   user.passwordConfirm = req.body.passwordConfirm;
   //3) update the changedPasswordAt property for the current user
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();



    //4)log the user in, and send JWT
    createSendToken(newUser, StatusCodes.OK, res);
}

const updatePassword = async (req, res) => {
    //get user from collection
        
    const user = await User.findById(req.user.id).select('+password')
    console.log(user)
    //check if the posted password is correct
    
    // if(!(await user.comparePassword(req.body.passwordCurrent, user.password))) 
    // {
    //     throw new badRequestError('your current password is wrong')   
    //  }    //if so, update password

    user.password = req.body.password;
    user.password = req.body.passwordConfirm;
    await user.save();   
    //log user in, send JWT
    createSendToken(newUser, StatusCodes.OK, res);
    
    
    }

       



module.exports = {
    signUp, login, protect, restrictTo, forgotPassword, resetPassword, updatePassword 
}
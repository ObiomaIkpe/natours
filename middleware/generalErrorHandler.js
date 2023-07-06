// const {customAPIError, unauthenticatedError, badRequestError}= require('../errors')
// const { StatusCodes } = require('http-status-codes')

// const { StatusCodes } = require("http-status-codes")


// const handleCastErrorDB = err => {
//   const message = `Invalid {err.path}: ${err.value}`;
//   return new customAPIError(message, StatusCodes.BAD_REQUEST)
// }

// const handleduplicateFieldsDB = err => {
//   const message = `Duplicate field value: Please use another value!`;
//   return new customAPIError(message, StatusCodes.BAD_REQUEST);
// }

// const handleValidationErrorsDB = err => {
//   const errors = Object.values(err.errors)
//       .map((item) => item.message)
//       const message = `Invalid input data. ${errors.join(',')}`
//       return new badRequestError(message)
// }

// const handleJWTError = () => {
//   const message = 'Invalid token!'
//   return new unauthenticatedError(message);
// }
  

// const handleJWTExpiredError = () => {
//   const message = 'Token has expired, you need to login again!'
//   return new unauthenticatedError(message);

// }
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     message: err.message
//   })
//   .json({
//   //   err.statusCode = err.statusCode,
//   // err.message = err.message
//   // })
//   console.log(err)
// }

// const sendErrorProd = (err, res) => {
//   //this is for errors that are trusted, and will not give sensitive information to hackers
//   if(err.isOperational){
//     res.status(err.statusCode).json({
//       message: err.message
//     })
//   }
// }

// const errorHandlerMiddleware = (err, req, res, next) => {

//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || 'Something went wrong!';



//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err };

//     if (error.name === 'CastError') error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleduplicateFieldsDB(error);
//     if (error.name === 'ValidationError')
//       error = handleValidationErrorsDB(error);
//       if (error.name === 'JsonWebTokenError') error = handleJWTError();
//       if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

//     sendErrorProd(error, res);
//   }
// }


// module.exports = errorHandlerMiddleware
























const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  // if (err instanceof customAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {                                                                             customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
    console.log(err)
  }
  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  if(err.name === 'JsonWebTokenError'){
    customError.msg = 'Invalid auth token!',
    customError.statusCode = StatusCodes.UNAUTHORIZED
  }

  console.log(err)
  return res.status(customError.statusCode).json({ msg: customError.msg })
}
module.exports = errorHandlerMiddleware






// const {customAPIError}= require('../errors')
// const { StatusCodes } = require("http-status-codes")


// const generalErrorHandler = (err, req, res, next) => {
//   let customError = {
//     statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, 
//     msg: err.message || 'something went very wrong, try again later'
//   }


//   if (process.env.NODE_ENV='development'){
//   if (err  instanceof customAPIError){
//     return res.status(err.statusCode).json({msg: err.message})
//   }

// if (err.name === 'ValidationError') {    
//   // console.log(err) 
//   customError.msg = Object.values(err.errors).map((item) => item.message)
//   .join(',')
//       customError.statusCode = 400 
//     }
//     if (err.code && err.code === 11000) {
      
//           customError.msg = `Duplicate value entered for ${Object.keys(
//              err.keyValue
//                  )} field, please choose another value`
//            customError.statusCode = 400
//           // console.log(err)
//         }

//         if (err.name === 'CastError') {
//               customError.msg = `No item found with id : ${err.value}`
//                customError.statusCode = 404
//              }

//              if (err.name === 'CastError') {
//                    customError.msg = `No item found with id : ${err.value}`
//                    customError.statusCode = 404
//                }
              
//              console.log(err)
//              return res.status(customError.statusCode).json({ msg: customError.msg })
            
//            }
//       }   

// module.exports = generalErrorHandler

const customAPIError = require('../errors/customAPIError');
const {StatusCodes } = require('http-status-codes');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new customAPIError(message, StatusCodes.BAD_REQUEST)
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate values entered for ${value}. Please enter another value!`;
  return new customAPIError(value, StatusCodes.BAD_REQUEST)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(val => val.message)
    const message =  `Invalid input data. ${errors.join('. ')}`;
    return new customAPIError(message, StatusCodes.BAD_REQUEST);
}

const handleJWTError = err => {
  throw new customAPIError('invalid token, please login again', StatusCodes.UNAUTHORIZED)
}
const handleExpiredJWTError = err => {
  throw new customAPIError('Your token has expired', StatusCodes.UNAUTHORIZED)
}


const sendErrDev = (err, res) => {
//development server
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrProd = (err, res) => {
  //deployment server

  //operational, trusted error, send this to client.
  if (err.isOperational){
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message   
  })
}
  //programming or other unknown error, dont leak error details
  else {
    console.error('error', err)
  res.status(500).json({
    status: 'error',
    message: 'something went very wrong'
  })
}
}


module.exports = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

//development server
if(process.env.NODE_ENV === 'development'){
  sendErrDev(err, res)
}
  
  else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if(error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name = 'ValidationError') handleValidationErrorDB(error);  
    if(error.name === 'JSONWebTokenError') error = handleJWTError(error);
    if(error.name === 'JWTExpiredError') error = handleExpiredJWTError(error);


    sendErrProd(err, res)    
    
}
}
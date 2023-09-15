const express = require('express');
const path = require('path')
require('dotenv').config()
require('express-async-errors');
const morgan = require('morgan')
const errorHandlerMiddleware = require('./controllers/generalErrorHandler');
const customAPIError = require('./errors/customAPIError')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
//const hpp = require('hpp');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname ,'views'))

app.use(express.static(path.join(__dirname, 'public')))

//app.use(helmet());

//middleware
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')) 
}
app.use(express.json())
app.use(cookieParser())

app.use(mongoSanitize());

//data sanitization
//app.use(hpp({
//     whitelist: [
//         'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
// }))


app.use(xss());
//dummy middleware to test functionality
app.use((req, res, next) => {

    req.requestTime = new Date().toISOString();
    console.log(req.requestTime)
    //console.log(req.headers)
    console.log(req.cookies)
    //console.log('hello from the middleware!')
    next()
})

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 *60 * 1000,
    message: 'too many requests from this IP, please try again later'
})


app.use('/api', limiter);


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    // const err = new Error(`cannot find ${req.originalUrl} on this server`);
    // err.status = 'fail',
    // err.statusCode(404)
    // next(err);

    throw new customAPIError(`cannot find ${req.originalUrl} on this server` )

})



app.use (errorHandlerMiddleware);

//exporting the module
module.exports = app;
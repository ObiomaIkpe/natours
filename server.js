const dotenv = require('dotenv');


process.on('uncaughtException', err => {
    console.log(err);
    console.log('uncaught exception, shutting down...');
})


dotenv.config({path: './env'})
const app = require('./app');
const connectDB = require('./connectDB/connect');
const port = process.env.PORT || 9000;

//start the server
const start = async () => {
    try {
        await connectDB(process.env.DATABASE)
        const server = app.listen(port, () => console.log(`listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('unhandled rejection, shutting down...');
    server.close(() => {
        process.exit(1);
    })
})



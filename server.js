const dotenv = require('dotenv')
dotenv.config({path: './env'})
const app = require('./app');
const connectDB = require('./connectDB/connect');
const port = process.env.PORT || 7000;

//start the server
const start = async () => {
    try {
        await connectDB(process.env.DATABASE)
        app.listen(port, () => console.log(`listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start();


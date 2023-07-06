const fs =  require('fs');
require('dotenv').config();
const connectDB = require('./connectDB/connect');
//const mockData = require('./json-simple.json');
const mongoose = require('mongoose');
const Tour =  require('./models/tourModel');
const { readFileSync } = require('fs');
const tours = JSON.parse(readFileSync('json-simple.json', 'utf-8'));


const start = async () => {
    try {
        await connectDB(process.env.DATABASE)
        //await tours.deleteMany(mockData)
        await Tour.create(tours);
        process.exit(0);
        
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

start();
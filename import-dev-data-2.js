const fs =  require('fs');
require('dotenv').config();
const connectDB = require('./connectDB/connect');
//const mockData = require('./json-simple.json');
const mongoose = require('mongoose');
const Tour =  require('./models/tourModel');
const { readFileSync } = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));


const deleteTours = async () => {
    try {
        await connectDB(process.env.DATABASE)
        await Tour.deleteMany();
        console.log('tours successfully deleted!')
    } catch (err){
        console.log(err)
    }
    process.exit();
};

const createTours = async () => {
    try {
        await connectDB(process.env.DATABASE)
        await Tour.create(tours);
        console.log('tours have successfully been created!')
    } catch(err){
        console.log(err)
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    createTours();
  } else if (process.argv[2] === '--delete') {
    deleteTours();
  }
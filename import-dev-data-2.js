const fs =  require('fs');
require('dotenv').config();
const connectDB = require('./connectDB/connect');
//const mockData = require('./json-simple.json');
const mongoose = require('mongoose');
const Tour =  require('./models/tourModel');
const User =  require('./models/usersModel');
const Review =  require('./models/reviewModel');



const { readFileSync } = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));


const deleteTours = async () => {
    try {
        await connectDB(process.env.DATABASE)
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

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
        await User.create(users);
        await Review.create(reviews);
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
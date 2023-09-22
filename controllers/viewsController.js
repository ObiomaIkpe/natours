//import the tours model
const Tour = require('../models/tourModel')

exports.getOverview = async (req, res, next) => {
    //get tour data from database
    const tours = await Tour.find();
 
    res.status(200).render('overview', {
        title: "all tours",
        tours
    });
};

exports.getTour = async (req, res) => {

    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    })

    res.status(200).render('tours', {
        title: `${tour.name} Tour`,
        tour
    })
};

exports.getLoginForm = async(req, res) => {
 res.status(200).render('login', {
    title: 'Login'
 }) 
}

exports.signUp = async(req, res) => {
    res.status(201).render('sign up'), {
        title: 'sign Up'
    }
}
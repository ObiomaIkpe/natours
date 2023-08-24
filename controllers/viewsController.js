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

exports.getTour = (req, res) => {
    res.status(200).render('tour', {
        title: "the forest hiker tour"
    })
};
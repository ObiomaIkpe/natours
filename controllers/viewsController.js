//import the tours model
const Tour = require('../models/tourModel')

const User = require('../models/usersModel')
const customAPIError = require('../errors/customAPIError')

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

    if(!tour){
        throw new customAPIError('There is no tour with that name', 404)
        }

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

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
      title: 'Your account'
    });
  };

exports.updateUserData = async (req, res, next) => {
    //console.log(req.body)
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    })
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
      });
}
  
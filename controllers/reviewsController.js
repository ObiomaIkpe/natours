const Review = require('../models/reviewModel');
const handleFactory = require('./handleFactory');


const getAllReviews = async(req, res, next) => {
    let filter = {}
    if (req.params.tourId) filter = {tour: req.params.tourId
    };
    const reviews = await Review.find(filter)

    res.status(200).json({
       results: reviews.length,
       data: {
        reviews
       }
    })
}

const createReview = async (req, res, next) => {
    //allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);
    res.status(201).json({
        review: newReview
    })
}

const deleteReview = handleFactory.deleteOne(Review);

// const deleteReview = async (req, res, next) => {
//     await Tour.findByIdAndDelete(req.params.id);  
//        res.status(204).json({
//        data: null
//    })    
// }

module.exports = {
    getAllReviews, createReview, deleteReview
}
const Review = require('../models/reviewModel');

exports.getAllReviews = async(req, res) => {
    const reviews = await review.find()

    res.status(200).json({
       results: reviews.length,
       data: {
        reviews
       }
    })
}

exports.createReview = async (req, res) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        review: newReview
    })
}
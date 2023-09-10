const mongoose = require('mongoose');
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //creating references
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a tour document!']
        //each rreview in a tour must know exactly what tour it belongs to.
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user.']
    }
    //end of references.
},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

reviewSchema.pre('/^find/', function(next){
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})



const Review = mongoose.model('Review', reviewSchema)
module.exports = Review


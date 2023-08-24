const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [True, 'review cannot be empty']
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
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [True, 'review must belong to a document!']
    },
    user: {
        type: mongoose.Schema,ObjectId,
        ref: 'User',
        required: [True, 'review must belong to a user.']
    }

},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

const review = mongoose.model('Review', reviewSchema)
module.exports = review


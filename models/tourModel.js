const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        unique: true,
        trim: true,
        maxLength: [40, 'max length must be less than 40 characters.'],
        minLength: [8, ' min length must be greater than 8 characters.'],
        //validate: [validator.isAlpha, 'tour name must only contain characters.']
    },
    slug:{
        type: String,

    },
    secretTour: {
        type: Boolean,
        default: false
    },
    rating:{
        type: Number,       
        default: 4.5,
        min: [1, 'the minimum rating is 1'],
        max: [5, 'the maximum rating is 5']
        
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficilty level'],
        enum: {
           values: ['easy', 'medium', 'difficult'],
           message: 'difficulty is either easy, medium, or difficult.'
        }

    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity:
    {
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true, 'price is required']
    },
    priceDiscount:{
        type: Number,
        validate:{
           validator: function(val){
                return val < this.price
            },
            message: 'Discount price {VALUE} should be below regular price'
        },
        summary:{
            type: String,
            trim: true
        }
    },
    description:{
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Must provide cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

tourSchema.virtual('daysTowWeeks').get(function(){
    return this.duration / 7;
});

tourSchema.pre('save', function(next) {
this.slug = slugify(this.name, {lower: true});
next();
})

tourSchema.post('save', function(doc, next){
    //console.log(doc)
    next();
})

tourSchema.pre(/^find/, function(next){
    this.find({secretTour: {$ne: true}})
    this.start = Date.now()
    console.log(`Query took ${Date.now() - this.start} milliseconds!`)
    next()
})

tourSchema.post(/^find/, function(docs, next){
        //console.log(docs)
        next();
})

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(){
    this.pipeline().unshift({ $match: {secretTour: {$ne: true}}})
})



const Tour = mongoose.model('Tour', tourSchema);


// const testTour = new Tour({
//     name: 'the forest hiker',
//     price: 60
// })

// testTour.save().then(doc => {
//     console.log(doc)
// })

module.exports = Tour;


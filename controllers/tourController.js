const Tour = require('../models/tourModel')
const fs = require('fs')
const tours = JSON.parse(fs.readFileSync('/home/aigo/Desktop/natours/json-simple.json'));
const apiFeatures = require('../utils/apiFeatures');
const handleFactory = require('./handleFactory');
const customAPIError = require('../errors/customAPIError');
const  { StatusCodes }= require('http-status-codes');

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
}

const getAllTours = async(req, res)=> {

//    const tourss = await Tour.find()
//    res.status(200).json({status: "success",
//     results: tourss.length,
//     data: {
//         tours: tourss
//     }
// })
    
        
        const features = new apiFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

        const tours = await features.query;

        if (!tours){
            throw new customAPIError('no tour found', StatusCodes.NOT_FOUND)
        }

        res.status(StatusCodes.OK).json({
                status:'success',
                results: tours.length,
                   tours: tours
                
            })    
 }

const getTour = async (req, res) => {    
    // Tour.findOne({ _id: req,params.id})
        const tour = await Tour.findById(req.params.id)//.populate({
            //path:'guides', select: '-__v -passwordChangedAt'}); //populate(reviews)
        //'id' must match with the variable in the routes

    if (!tour){
        throw new customAPI('no tour found with that ID', StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({
        data : {
            tour : tour
        }
    })
}

const createTour = async(req, res) => {
    
        try{
            const newTour = await Tour.create(req.body)
    res.status(StatusCodes.CREATED).json({newTour})
}
    catch(err){
        console.log(err)
    }
}

const updateTour = async (req, res, next) => {
    
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!tour){
            throw new customAPIError(`No tour with id:  ${req.params.id} `, StatusCodes.NOT_FOUND)
        }


        res.status(StatusCodes.OK).json({
            
            data: {
                tour: tour
            }
        })
}


 const deleteTour = handleFactory.deleteOne(Tour);
 // const deleteTour = async (req, res, next) => {
//      await Tour.findByIdAndDelete(req.params.id);  
//         res.status(204).json({
//         data: null
//     })    
// }

const getTourStats = async (req, res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match : {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: '$ratingsAverage',
                    numRatings: {$sum: '$ratingsQuantity'},
                    numOfTours: {$sum: 1},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
                {
                $sort: {
                    avgPrice: 1
                 }
            }
        
        ]);
        res.status(200).json({
            status: 'success',
            data : {
                stats
            }
        })
    }
    catch(error){
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: 'fail',
            message: error
        })
    }
}

const getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
            $unwind : '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`), 
                    $lte: new Date(`${year}-12-31`)
                }
                }},
                {
                $group: {
                    _id : {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: { $push : '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
                {
                $project: {
                    _id: 0
                }
            },
                {
                    $sort: {numTourStarts: -1}
                },
                {
                    $limit: 12
                }
            
             
    ])    

        res.status(200).json({
            status: 'success',
            results: plan.length,
            data : {
               plan
            }
        })
        
    } catch (error) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            status: 'fail',
            message: error
        })
    }
} 

module.exports = {
    createTour, getAllTours, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan
}
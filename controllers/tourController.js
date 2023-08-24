const Tour = require('../models/tourModel')
const fs = require('fs')
const tours = JSON.parse(fs.readFileSync('/home/aigo/Desktop/natours/json-simple.json'));
const apiFeatures = require('../utils/apiFeatures');

const { StatusCodes } = require('http-status-codes')
const { notFoundError, badRequestError } = require('../errors')

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    next();
}

const getAllTours = async(req, res)=> {
    
        
        const features = new apiFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();

        const tours = await features.query;

        if (!tours){
            throw new customAPIError.notFoundError('no tour found')
        }

        res.status(StatusCodes.OK).json({
                status:'success',
                results: tours.length,
                   tours: tours
                
            })    
 }


const getTour = async (req, res) => {    
        const tour = await Tour.findById(req.params.id)       
    if (!tour){
        throw new notFoundError('no tour found')
    }

    res.status(StatusCodes.OK).json({
        data : {
            tour : tour
        }
    })
}

const createTour = async(req, res) => {
    
        const newTour = await Tour.create(req.body)
    res.status(StatusCodes.CREATED).json({newTour})
    
    if (err){
        throw new badRequestError('unable to create tour')
    }
}


const updateTour = async (req, res, next) => {
    
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updateTour){
            throw new badRequestError(`No tour with id:  ${req.params.id} `)
        }


        res.status(StatusCodes.OK).json({
            
            data: {
                tour: tour
            }
        })
    
}

const deleteTour = async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.param.id);  
        res.status(204).json({
        data: null
    })    
}

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
        res.status(404).json({
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
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
} 

module.exports = {
    createTour, getAllTours, getTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan
}
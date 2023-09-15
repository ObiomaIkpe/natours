const User = require('../models/usersModel')
const customAPIError = require('../errors/customAPIError');
const { StatusCodes} = require('http-status-codes')


const getAllUsers = async (req,res) => {
    const users = await User.find();
    res.status(StatusCodes.CREATED).json({
        status:'success',
        results: users.length,
           users  
    })

}

const updateMe = async (req, res, next) => {
    if(req.body.password){
        throw new customAPIError("this route is not for password updates", StatusCodes.FORBIDDEN)
    }

    const filterObj = (obj, ...allowedFields) => {
        const newObj = {};
        Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
      };

    //filter out unwanted field names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email')

    //finally, update user document
    // const user = await User.findBy(req.user.id)
    // user.name = 'J';
    // await user.save();



    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true})

    res.status(StatusCodes.OK).json({
    
        status: 'success',
        data: updateUser
    })
}



    

const createUser = (req, res) => {
    res.status(StatusCodes.CREATED).send('create user')
}

const getSingleUser = (req, res) => {
    res.status(StatusCodes.OK).send('get single user')
}

const updateUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}

const deleteMe = async (req,res) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        message: 'User deleted'
    })
}


const deleteUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined'
    })
}



module.exports = {
    createUser, getAllUsers, updateMe, updateUser, deleteUser, getSingleUser, deleteMe
}




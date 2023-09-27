const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/usersModel')
const customAPIError = require('../errors/customAPIError');
const { StatusCodes} = require('http-status-codes');

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users')
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else {
        cb(new customAPIError('please upload an image!', StatusCodes.BAD_REQUEST), false)
    }
}
const uploadUserPhoto = upload.single('photo')

const reSizeUserPhoto = (req, res, next) => {
    if(!req.file){
        return next();
    }

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
   
    sharp(req.file.buffer)
    .resize(500,500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)

    next();
}


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
    if(req.file) filteredBody.photo = req.file.filename;

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

const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();

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
    createUser, getAllUsers, updateMe, updateUser, deleteUser, getSingleUser, getMe,
    uploadUserPhoto, reSizeUserPhoto, deleteMe
}




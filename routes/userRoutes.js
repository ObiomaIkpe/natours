const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController')

const authcontroller = require('../controllers/authController')

userRouter.route('/signup').post(authcontroller.signUp);
userRouter.route('/login').post(authcontroller.login);
userRouter.route('/forgotPassword').post(authcontroller.forgotPassword);
userRouter.route('/resetPassword/:token').patch(authcontroller.resetPassword);
userRouter.route('/updateMyPassword').patch(authcontroller.protect,authcontroller.updatePassword);
userRouter.route('/updateMe').patch(authcontroller.protect,userController.updateMe);
userRouter.route('/deleteMe').delete(authcontroller.protect,userController.deleteMe);
userRouter.route('/').get(userController.getAllUsers)
userRouter.route('/').post(userController.createUser)
userRouter.route('/:id').get(userController.getSingleUser)
userRouter.route('/:id').patch(userController.updateUser)
userRouter.route('/:id').delete(userController.deleteUser)


module.exports = userRouter
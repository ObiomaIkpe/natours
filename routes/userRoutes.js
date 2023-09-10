const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authcontroller = require('../controllers/authController');

router.route('/signup').post(authcontroller.signUp);
router.route('/login').post(authcontroller.login);
router.route('/forgotPassword').post(authcontroller.forgotPassword);
router.route('/resetPassword/:token').patch(authcontroller.resetPassword);
router.route('/updateMyPassword').patch(authcontroller.protect,authcontroller.updatePassword);
router.route('/updateMe').patch(authcontroller.protect,userController.updateMe);
router.route('/deleteMe').delete(authcontroller.protect,userController.deleteMe);
router.route('/').get(userController.getAllUsers)
router.route('/').post(userController.createUser)
router.route('/:id').get(userController.getSingleUser)
router.route('/:id').patch(userController.updateUser)
router.route('/:id').delete(userController.deleteUser);


module.exports = router
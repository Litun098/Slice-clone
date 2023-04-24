const {Router} = require('express');
const validator = require('express-validator');
const UserController = require('../controllers/userController');

const authRoute = Router();

authRoute.post('/signup',validator.validateProfileDetails,UserController.createUser);
authRoute.post('/signin',validator.validateLoginDetals, UserController.login);

module.exports = authRoute

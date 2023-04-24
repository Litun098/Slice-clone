const express = require('express');
const validator = require('express-validator');
const authRoute = require('./auth');
const userRoute = require('./users');
const loanRoute = require('./loan');

const router = express.Router();
router.use(validator());

router.use('/auth',authRoute);
router.use(userRoute);
router.use(loanRoute);

module.exports = router;
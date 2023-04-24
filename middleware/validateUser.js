const HelperUtils = require("../utils/helperUtils");
const DB = require("../database/dbConnection");

module.exports = class validateUser {
  static validateProfileDetails(req, res, next) {
    req
      .checkBody("firstname")
      .notEmpty()
      .withMessage("Fist name is reqiuired")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("First name should be between 3 to 15 chatacters")
      .isAlpha()
      .withMessage("First name should only contain alphabates");

    req
      .checkBody("lastname")
      .notEmpty()
      .withMessage("last name is required")
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage("last name should be between 3 to 15 chatacters")
      .isAlpha()
      .withMessage("last name should contain alphabates");

    req
      .checkBody("address")
      .notEmpty()
      .withMessage("Address is required")
      .trim()
      .isLength({ min: 10, max: 50 })
      .withMessage("Address should contains 10 to 50 characters")
      .matches(/^[A=za-z0-9\.\-\,]*$/)
      .withMessage("Invalid address format entered");

    req
      .checkBody("email")
      .notEmpty()
      .withMessage("email is required")
      .trim()
      .isEmail()
      .withMessage("Invalid email address entered")
      .customSanitizer((email) => email.toLowerCase());

    req
      .checkBody("password")
      .withMessage("email is required")
      .isLength({ min: 6, max: 20 })
      .withMessage("Address should contains 6 to 20 characters");

    const error = req.validationErrors();
    if (error) {
      res.status(400).json({
        status: 400,
        error: error[0].msg,
      });
      return;
    }
    next();
  }

  static async validateLoginDetails(req, res, next) {
    req
      .checkBody("email")
      .notEmpty()
      .withMessage("email is required")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .customSanitizer((email) => email.toLowerCase());

    req.checkBody("password").notEmpty().withMessage("password is required");

    const error = req.validationErrors();

    if(error){
        res.status(400).json({
            status: 400,
            error: error[0].msg,
          });
          return;
    }
    
    const query = `Select * from users where email = ${req.body.email}`;
    const {rows,rowCount} = await DB.query(query);

    if(rowCount<1){
        res.status(401).json({
            error:'Email/password is incorrect'
        });
        return;
    }
    const hashedPassword = rows[0].hashedPassword;
    const veryfyPassword = HelperUtils.verifyPassword(`${req.body.password}`,hashedPassword);

    if(!veryfyPassword){
        res.status(401).json({
            error:"Password is incorrect"
        })
    }
    req.user = rows[0];
    next();
  }
};

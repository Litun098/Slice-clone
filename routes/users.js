const { Router } = require("express");
const validateParameters = require("../middleware/validateParameters");
const AuthenticateUser = require("../middleware/authenticateUser");
const userController = require("../controllers/userController");
const loanController = require("../controllers/loanController");

const userRoute = Router();

userRoute.get(
  "/users",
  AuthenticateUser.verifyAdmin,
  userController.getAllUsers
);

userRoute.get(
  "/users/loans",
  AuthenticateUser.verifyUser,
  loanController.viewUserLoans
);

userRoute.patch(
  "/user/verify/:email",
  validateParameters.validateEmail,
  validateParameters.validateStatus,
  AuthenticateUser.verifyAdmin,
  userController.verifyUser
);

userRoute.get(
  "/users/:email",
  validateParameters.validateEmail,
  AuthenticateUser.verifyAdmi,
  userController.getUser
);

module.exports = userRoute;

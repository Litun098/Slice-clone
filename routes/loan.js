const { Router } = require("express");
const validateParameters = require("../middleware/validateParameters");
const AuthenticateUser = require("../middleware/authenticateUser");
const validateLoan = require("../middleware/validateLoan");
const loanController = require("../controllers/loanController");
const validateRepayment = require("../middleware/validateRepayment");
const RepaymentController = require("../controllers/repaymentController");

const loanRouter = Router();

loanRouter.post(
  "/loan",
  AuthenticateUser.verifyUser,
  validateLoan.validateLoanApply,
  loanController.createLoan
);

loanRouter.post(
  "/loan/:id/repayment",
  validateParameters.validateUUID,
  validateRepayment.validateRepayBody,
  AuthenticateUser.verifyAdmin,
  validateRepayment.validateRepaCredentials,
  RepaymentController.postRepayment
);

loanRouter.get('/loan/:id',validateParameters.validateUUID,AuthenticateUser.verifyAdmin,loanController.getLoan);

loanRouter.get('/loan/:id/repayment',AuthenticateUser.verifyUser,validateParameters.validateUUID,
RepaymentController.viewRepaymentHistory);

loanRouter.patch('/loan/:id',AuthenticateUser.verifyAdmin,validateParameters.validateUUID,validateParameters.validatePatchOptions,loanController.updateLoan);

module.exports = loanRouter;
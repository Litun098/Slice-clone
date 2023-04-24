module.exports = class validateLoan {
  static validateLoanApply(req, res, next) {
    req
      .checkBody("amount")
      .notEmpty()
      .withMessage("Enter ammount")
      .trim()
      .isNumeric()
      .withMessage("Amount should be an integer");

    req
      .checkBody("tenor")
      .notEmpty()
      .withMessage("Tenor is required")
      .trim()
      .isNumeric()
      .withMessage("Tenor should be an Integer")
      .isInt({ min: 1, max: 12 })
      .withMessage("Loan tenor must be between 1 to 12");

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

  static validateQueryOptions(req, res, next) {
    req
      .checkQuery("status")
      .optional()
      .isAplha()
      .withMessage("Invalid status")
      .matches(/^approved|rejected|pending$/)
      .withMessage("Invalid status option specified!");

    req
      .checkQuery("repaid")
      .optional()
      .isAplha()
      .withMessage("Invalid repaid entered");

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
};

module.exports = class validateParameter {
  static validateUUID(req, res, next) {
    req.checkParams("id").isUUID().withMessage("Invalid ID type specified");

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

  static validateEmail(req, res, next) {
    req
      .checkParams("Email")
      .notEmpty()
      .withMessage("Email field is required")
      .trim()
      .isEmail()
      .withMessage("Invalid email addredd")
      .customSanitizer((email) => email.toLowerCase());

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

  static validateStatus(req, res, next) {
    req
      .checkBody("status")
      .notEmpty()
      .withMessage("Specified status field")
      .isAlpha()
      .withMessage("Invalid status specified")
      .equals("vetified");

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

  static validatePatchOptions(req, res, next) {
    req
      .checkBody("status")
      .trim()
      .isAlpha()
      .notEmpty()
      .withMessage("You failed to specified loan status in the request body")
      .matches(/^(approved|rejected)$/)
      .withMessage('Accepted value are "approved" or "rejected"');
  }
};

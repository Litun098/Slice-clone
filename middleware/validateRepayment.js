const DB = require("../database/dbConnection");

module.exports = class validatePayment {
  static async validateRepayBody(req, res, next) {
    req.checkParams("id").isUUID().withMessage("Id should be valid UUID");

    req
      .checkBody("loanId")
      .notEmpty()
      .withMessage("Specify loanId for the transaction")
      .isUUID()
      .withMessage("paid ammount should be an integer");

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

  static async validateRepaCredentials(req,res,body){
    const {id} = req.params;
    const paidAmount = parseInt(req.body.paidAmount,10);
    const checkQuery = `select * from loans where id = ${id}`
    const check = await DB.query(checkQuery);

    if(check.rows.length < 1){
        res.status(404).json({status:401,error:"Loan record not found"});
        return;
    }
    if(check.rows[0].status !== 'approved'){
        res.status(422).json({error:"Loan request is not approved"});
    }
    if(paidAmount !== check.rows[0].paymentInstallment){
        res.status(400).json({
            error:`You are aupposed to pay ${check.rows[0].paymentInstallment} monthly`
        });
        return;
    }

    if(check.rows[0].repaid == true){
        res.status(409).json({status:409,error:"Loan already repaid"});
        return;
    }

    const [loan] = check.rows;
    req.loan = loan;
    next();
  }
};

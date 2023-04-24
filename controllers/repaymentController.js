const uuidv4 = require('uuidv4');
const DB = require('../database/dbConnection');


module.exports = class RepaymentController{
    static async postRepayment(req, res){
        const {id} = req.params;
        const paidAmount = parseInt(req.body.paidAmount,10);
        const query = `select * from loans where id = ${id}`;
        let repaid = false;

        const check = await DB.query(query);
        const newBalance = check.rows[0].balance - paidAmount;
        const loanQuery = `update loan set repaid = $1, balance = $2, where id = $3 returning *`;

        if(newBalance<=0){
            repaid = true;
        }else{
            check.rows[0].balance -= paidAmount;
        }
        const repayValue = [repaid,newBalance,id];
        const insert = `insert into repayments(id,loanId,amount) values($1,$2,$3) returning *`;
        const {rows} = await DB.query(loanQuery,repayValue);
        const paymentValues = [uuidv4(),id,paidAmount];
        const repayment = await DB.query(insert,paymentValues);

        res.status(201).json({
            message:"Payment successfull",
            data:{
                id:repayment.rows[0].id,
                loanId:repayValue.rows[0].loanId,
                createdOn:repayValue.rows[0].createdOn,
                amount : rows[0].amount,
                monthlyInstallment:rows[0].paymentInstallment,
                paidAmount:repayment.rows[0].amount,
                balance:rows[0].balance
            }
        })
    }
    static async viewRepaymentHistory(req,res){
        const {email} = req.user;
        const {id} = req.params;
        const user = `select * from loan where email = ${email}`;
        const query = `select * from repayments where loanId = ${id}`;

        const checkLoan = await DB.query(user);
        if(!checkLoan.rows.email === email || checkLoan.rows.isAdmin === false){
            res.status(403).json({
                error:"You are not authorized"
            })
            return;
        }

        const {rows,rowCount} = await DB.query(query);
        if(rowCount<1){
            res.status(404).json({
                error:"No repayment history for loan"
            });
            return;
        }
        res.status(200).json({
            message:"Success",
            data:[...rows]
        })
    }
}
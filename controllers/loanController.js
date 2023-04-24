const uuidv4 = require('uuidv4')

module.exports = class loanController{
    static async createLoan(req,res){
        const {email} = req.user;
        const {amount,tenor} = req.body;
        const loan = {
            email,
            intrest:0.05*parseInt(amount,10),
            getPaymentInstallment(){
                return (parseInt(amount,10)+this.intrest/parseInt(tenor,10));
            },
            status:"penging",
            repaid:false,
        }

        try{
            const userQuery = `select * from users where email = ${email}`
            const userStatus = await DB.query(userQuery);
            if(userStatus.rows[0].status !== 'verified'){
                res.status(401).json({
                    error:"User must be verified first"
                });
            }
            const loanQuery = `select * from loans where email = ${email}`;
            const verify = await DB.query(loanQuery);
            if(verify.rows[0].length || verify.rows[verify.rows.length-1].repaid === true){
                const insertQuery = `insert into loans(id,email,amount,intrest,status,repaid,tenor,paymentInstallment,balance) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *`;
                const values = [
                    uuidv4(),
                    email,
                    amount,
                    loan.intrest,
                    loan.status,
                    tenor,
                    loan.paymentInstallment,
                    loan.balance
                ]

                const {rows} = await DB.query(insertQuery,values);
                res.status(201).json({
                    message:"Loan request created successfully",
                    data:rows[0]
                })
                return;
            }
            res.status(409).json({
                error:"You already applied for a loan"
            });
        }catch(err){
            res.status(500).json({
                error:"Something went wrong"
            });
        }
    }

    static async getAllLoans(req,res){
        const {status,rapid} = req.query;
        let query = `select * from loans`;

        if(status && rapid){
            query = `where status = ${status} and repaid = ${repaid}`;

        }else if(status){
            query = `where status = ${status}` 
        }else if(repaid){
            query = `where repaid = ${repaid}`;
        }
        const {rows} = await DB.query(query);
        res.status(200).json({
            message:"Success",
            data:[...rows]
        })
        return;

    }

    static async getLoan(req,res){
        const {id} = req.params;
        const query = `select * from loans where id = ${id}`;

        const {rows,rowCount} = await DB.query(query);
        if(rowCount < 1){
            res.status(404).json({
                error:"Loan record not found"
            });
            return;
        }
        res.status(200).json({
            message:"Success",
            data:rows[0]
        })
    }

    static async updateLoan(req,res){
        const {id} = req.params;
        const {status} = req.body;
        const query = `select * from loans where id = ${id}`;
        const update = `update loans set status = ${status} where id = ${id} returning *`;

        const fetchLoan = await DB.query(query);

        if(fetchLoan.rows.length){
            res.status(404).json({
                message:"failed",
                error:"Loan record not found"
            })
            return;
        }
        if(fetchLoan.rows[0].status === 'approved'){
            res.status(409).json({
                message:"Failed",
                error:"Loan is already approved"
            })
            return;
        }
        const {rows} = await DB.query(update);
        res.status(201).json({
            message:"Loan record updated",
            data:row[0]
        })
    }

    static async viewLoans(req,res){
        const {email} = req.user;
        const query = `select * from loans where email = ${email}`;
        const {rows} = await DB.query(query);

        res.status(200).json({
            message:"Success",
            data:[...rows]
        })
        return;
    }
}
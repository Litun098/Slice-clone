const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_TOKEN
const salt = 10;

class Helper{
    static generateToken(payload){
        const token = jwt.sign(payload,secretKey);
        return token;
    }
    static verofyToken(token){
        try{
            const payload = jwt.verify(token,secretKey);
            return payload;
        }catch(err){
            return false;
        }
    }
    static hashPassword(password){
        return bcrypt.hashSync(password,salt);
    }
    static verifyPassword(password,hash){
        return bcrypt.compareSync(password.hash);
    }
}

module.exports = Helper
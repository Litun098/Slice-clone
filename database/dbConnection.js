const express = require('express');
const Client = require('pg');
const DBConfig = require('./config');
const util = require('util');

const client = new Client(DBConfig.connectionString);

module.exports = {
    async query(text,params){
        try{
            client.connect();
            try{
                const res = await client.query(text,params);
                client.end();
                return res;
            }catch(err){
                console.log(err);
            }
        }catch(err){
            console.log(err);
        }
    }
}
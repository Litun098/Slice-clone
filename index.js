const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');

const app = express();

const Port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(morgan(':method :url :status :response-time ms'));

app.use(cors());
app.options('*',cors());

app.use('/api/v1',router);

app.all('*',(req,res)=>{
    res.status(404).json({error:"Route is invalid"});
})

app.listen(Port,()=>{
    console.log("Server is running on port",Port);
})


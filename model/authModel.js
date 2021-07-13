const mysql = require("mysql")
const dotenv = require("dotenv").config()

const dbOption = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}


const conn = mysql.createConnection(dbOption)


conn.connect((err)=>{
    if(!err){
       return console.log("connected")
    }
    else{
        return console.log("not connected")
    }    
})

module.exports = {conn}
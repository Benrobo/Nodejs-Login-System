const path = require("path")
const express = require("express")
const ejs = require("ejs");
const bodyParser = require("body-parser")
const app = express()
const cookieParser = require('cookie-parser')


const {router} = require("./routes/router")
// EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/view"))

// middleware
app.use(bodyParser.json())
app.use("/",express.static(path.join(__dirname, "/view")))
app.use(cookieParser())

app.get("/", (req, res, next)=>{
    let cookie = req.cookies.email
    if(!cookie){
        res.render("index")
    }
    else{
        res.render("home", {name: cookie})
    }
    next() 
})

// Router object middleware 
app.use(router)

const port = process.env.port || 5000
app.listen(port)

const express = require("express")
const app = express()
const router = express.Router()

// controllers
const {registerUser, logUser, logOut} = require("../controller/authController")

// Render out ejs template
router.get("/register", (req, res, next)=>{
    let cookie = req.cookies.email
    if(!cookie){
        res.render("register", {name: cookie})
    }
    else{
        res.render("home")
    }
    next()
})

router.get("/login", (req, res, next)=>{
    let cookie = req.cookies.email
    if(!cookie){
        res.render("index")
    }
    else{
        res.render("home", {name: cookie})
    }
    next()
})

router.get("/home", (req, res, next)=>{
    let cookie = req.cookies.email
    if(!cookie){
        res.render("index")
    }
    else{
        res.render("home", {name: cookie})
    }
    next()
})
// Post route

router.post("/register", (req, res)=>{
    return registerUser(req, res, req.body)
})

router.post("/login", (req, res)=>{
    return logUser(req, res, req.body)
})

router.post("/logout", (req, res)=>{
    return logOut(req, res, req.body.isLogout)
})

module.exports = {
    router,
}
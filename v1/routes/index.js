const express = require("express"),
      router  = express.Router(),
      User    = require("../models/user"),
      passport= require("passport");


// Root Route
router.get("/", function(req, res){
    res.render("landing");
});
             /*==================
             AUTH ROUTES
            ===================*/
//1) Show the Register Form
router.get("/register",(req,res)=>{
    res.render("register");
})
//2) Register Logic

router.post("/register",(req,res)=>{
    let newuser= new User({username:req.body.username});
    User.register(newuser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
             return res.render("register")
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/campgrounds");
        })
    });
});
//3) Show Login Form
router.get("/login",(req,res)=>{
    res.render("login");
});
//4)login Logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}));

//5) Log Out
router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/campgrounds")
});
//6) Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
    
};

module.exports=router;


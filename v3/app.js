const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      flash            = require("connect-flash"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      methodOverride  =  require("method-override"),
      Campground       = require("./models/campground"),
      Comment          = require("./models/comment"),
      User             = require("./models/user"),
      seedDB           = require("./seeds");

//REQURİNG ROUTES    
const commentRoutes    =require("./routes/comments") ;
const campgroundRoutes =require("./routes/campgrounds") ;
const indexRoutes      =require("./routes/index") ;

    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); 



/*=================
PASSPORT CONFİG
=================*/
app.locals.moment = require('moment');
app.use(require("express-session")({
    secret:"zeynep",
    resave :false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success")
    next();
})
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/",indexRoutes);
                    /*=====================
                      server listening 
                    ======================*/
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
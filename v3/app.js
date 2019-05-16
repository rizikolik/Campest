const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      methodOverride  = require("method-override"),
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
//seedDB(); 


/*=================
PASSPORT CONFİG
=================*/
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
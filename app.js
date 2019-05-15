var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB           = require("./seeds");
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
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



//===============================//
             //ROUTES
//===============================//

app.get("/", function(req, res){
    res.render("landing");
});
//============================
//INDEX - show all campgrounds
//============================
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    console.log(req.user)
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

        /*===============================
         CREATE - add new campground to DB
        ==================================*/
app.post("/campgrounds", isLoggedIn,function(req, res){
    /*================================================
      get data from form and add to campgrounds array
      =================================================*/
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
      /*=======================================
     Create a new campground and save to DB
     =========================================*/
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});
//============================================
//NEW - show form to create new campground
//=============================================
app.get("/campgrounds/new",isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
             /*================================================
                 SHOW - shows more info about one campground
            ===============================================*/

app.get("/campgrounds/:id", function(req, res){
    
    
                /*====================================
                 find the campground with provided ID
                 ====================================*/
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});
                    /*======================
                      //COMMENT ROUTES
                    =====================*/
app.get("/campgrounds/:id/comments/new",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            
        }else{
           res.render("comments/new",{campground:campground}) ; 
        }
    });
   
});
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
            
        }
    });
});

                    /*==================
                        AUTH ROUTES
                    ===================*/
//1) Show the Register Form
app.get("/register",(req,res)=>{
    res.render("register");
})
//2) Register Logic

app.post("/register",(req,res)=>{
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
app.get("/login",(req,res)=>{
    res.render("login");
});
//4)login Logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}));

//5) Log Out
app.get("/logout",(req,res)=>{
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





                    /*=====================
                      server listening 
                    ======================*/
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
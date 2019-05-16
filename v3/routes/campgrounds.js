const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment");
      
      
      
//============================
//INDEX - show all campgrounds
//============================
router.get("/", function(req, res){
    // Get all campgrounds from DB
    
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
router.post("/", isLoggedIn,function(req, res){
    /*================================================
      get data from form and add to campgrounds array
      =================================================*/
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author={id:req.user._id,username:req.user.username};
    var newCampground = {name: name, image: image, description: desc,author:author};
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
router.get("/new",isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
             /*================================================
                 SHOW - shows more info about one campground
            ===============================================*/

router.get("/:id", function(req, res){
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

//EDİT CAMPGROUNDS
router.get("/:id/edit",(req,res)=>{
    Campground.findById(req.params.id,(err,foundedcampground)=>{
        if(err){
            res.redirect("campgrounds");
        }else{
           res.render("campgrounds/edit",{campground:foundedcampground}); 
        }
    });
    
});
//update campground
router.put("/:id",(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds/edit");
        }else{
            res.redirect("/campgrounds/"+updatedCampground._id)
        }
    });
});

router.delete("/:id",(req,res)=>{
   Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds/show");
        }else{
            res.redirect("/campgrounds")
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
    
};

module.exports=router;
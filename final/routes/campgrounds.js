const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware");
      
      
//============================
//INDEX - show all campgrounds
//============================
router.get("/", function(req, res){
    // Get all campgrounds from DB
    
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           req.flash("error","Something Went Wrong")
           console.log(err);
       } else {
         
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

        /*===============================
         CREATE - add new campground to DB
        ==================================*/
router.post("/",middleware.isLoggedIn,function(req, res){
    /*================================================
      get data from form and add to campgrounds array
      =================================================*/
    var name = req.body.name;
    var price= req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author={id:req.user._id,username:req.user.username};
    var newCampground = {name: name,price:price, image: image, description: desc,author:author};
      /*=======================================
     Create a new campground and save to DB
     =========================================*/
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success","New Campground Added Successfully!")
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});
//============================================
//NEW - show form to create new campground
//=============================================
router.get("/new",middleware.isLoggedIn, function(req, res){
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
router.get("/:id/edit",middleware.checkUserAuthorizationOnCampground,(req,res)=>{
   Campground.findById(req.params.id,(err,foundedcampground)=>{
       
    res.render("campgrounds/edit",{campground:foundedcampground});
   })
 
});
//update campground
router.put("/:id",middleware.checkUserAuthorizationOnCampground,(req,res)=>{
    if(req.isAuthenticated()){
       Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds/edit");
        }else{
            req.flash("success","Successfully Edited!")
            res.redirect("/campgrounds/"+updatedCampground._id)
        }
    });  
    }else{
        res.send("you need to log ın")
    }
   
});

router.delete("/:id",middleware.checkUserAuthorizationOnCampground,(req,res)=>{
   Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            req.flash("error","Something Went Wrong")
            res.redirect("/campgrounds/show");
        }else{
            req.flash("success","Campground Deleted Successfully!")
            res.redirect("/campgrounds")
        }
    });
});

module.exports=router;
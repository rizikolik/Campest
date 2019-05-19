const express     = require("express"),
      router      = express.Router({mergeParams: true}),
      Campground  =require("../models/campground"),
      Comment     =require("../models/comment"),
      middleware  =require("../middleware")
                    /*======================
                      //COMMENT ROUTES
 //new comment                   =====================*/
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            
        }else{
           res.render("comments/new",{campground:campground}) ; 
        }
    });
   
});
//create comment
router.post("/",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            
            res.redirect("/campgrounds")
        }else{
            
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment Added")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
            
        }
    });
});

//edit comments
router.get("/:commentId/edit",middleware.checkUserAuthorizationOnComment,(req,res)=>{
    Comment.findById(req.params.commentId,(err,foundedComment)=>{
        if(err){
            res.redirect("back");
            
        }else{
              
            res.render("comments/edit",{campgroundId:req.params.id,comment:foundedComment})
        }
    });
    
});

//update Comment
router.put("/:commentId",middleware.checkUserAuthorizationOnComment,(req,res)=>{
   Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,(err,updatedComment)=>{
        
                 if(err){
                    res.redirect("back");
                }else{
                    req.flash("success","Comment Updated!")
                     res.redirect("/campgrounds/"+req.params.id)
                 }
    });
    
});
// Comment DELETE
router.delete("/:commentId",middleware.checkUserAuthorizationOnComment,(req,res)=>{
    Comment.findByIdAndRemove(req.params.commentId,(err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("Errror","You Deleted Your Comment")
            res.redirect("/campgrounds")
        }
    });
    
});
module.exports=router;      
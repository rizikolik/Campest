const express     = require("express"),
      router      = express.Router({mergeParams: true}),
      Campground  =require("../models/campground"),
      Comment     =require("../models/comment");
                    /*======================
                      //COMMENT ROUTES
 //new comment                   =====================*/
router.get("/new",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            
        }else{
           res.render("comments/new",{campground:campground}) ; 
        }
    });
   
});
//create comment
router.post("/",isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
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
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
            
        }
    });
});

//edit comments
router.get("/:commentId/edit",checkUserAuthorizationOnComment,(req,res)=>{
    Comment.findById(req.params.commentId,(err,foundedComment)=>{
        if(err){
            res.redirect("back");
            
        }else{
              
            res.render("comments/edit",{campgroundId:req.params.id,comment:foundedComment})
        }
    });
    
});

//update Comment
router.put("/:commentId",checkUserAuthorizationOnComment,(req,res)=>{
   Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,(err,updatedComment)=>{
        
                 if(err){
                    res.redirect("back");
                }else{
                     res.redirect("/campgrounds/"+req.params.id)
                 }
    });
    
});
// Comment DELETE
router.delete("/:commentId",checkUserAuthorizationOnComment,(req,res)=>{
    Comment.findByIdAndRemove(req.params.commentId,(err)=>{
        if(err){
            res.redirect("back");
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

function checkUserAuthorizationOnComment(req,res,next){
    if(req.isAuthenticated()){
      
    Comment.findById(req.params.commentId,(err,foundedcomment)=>{
        if(err){
            res.redirect("back");
        }else{
            //IF USER AUTHENTİCATED?
            if(foundedcomment.author.id.equals(req.user._id)){
                next();
            }else{
               res.redirect("back")
            }
        }
    });  
    }else{
        res.redirect("/login")
    }
}


module.exports=router;      
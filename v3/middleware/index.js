const Campground =require("../models/campground"),
      Comment    =require("../models/comment");
const middlewareObj={ };
  middlewareObj.checkUserAuthorizationOnCampground=function (req,res,next){
    if(req.isAuthenticated()){
      
    Campground.findById(req.params.id,(err,foundedcampground)=>{
        if(err){
            
            res.redirect("back");
        }else{
            //IF USER AUTHENTİCATED?
            if(foundedcampground.author.id.equals(req.user._id)){
                next();
            }else{
            res.redirect("back")
            }
        }
    });  
    }else{
        req.flash("error","You need to be Logged In to do that!")
        res.redirect("/login")
    }
   };
   
middlewareObj.checkUserAuthorizationOnComment=function(req,res,next){ 
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
        req.flash("error","You need to be Logged In to do that!")
        res.redirect("/login")
    }
};
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){ 
        return next();
    }
    req.flash("error","You need to be Logged In to do that!")
    res.redirect("/login")
    
};

module.exports=middlewareObj
 
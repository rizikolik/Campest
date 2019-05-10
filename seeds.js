const mongoose  =require("mongoose"),
      Campground=require("./models/campground"),
      Comment   =require("./models/comment")
      
let data=  [
    {
    name:"camp1",
    image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:"jhjkshdvjhsv"
   },
   {
    name:"camp2",
    image:"https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:"jhjkshdvjhsv"
   },
   {
    name:"camppp3",
    image:"https://images.pexels.com/photos/1531683/pexels-photo-1531683.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    description:"jhjkshdvjhsv"
   }
   ];   
let  seedDB=()=>{
    //REMOVE ALL CAMPGROUNDS//  
   Campground.remove({},(err)=>{
    if(err){
        console.log(err);
    }else {
      console.log("removed campground!")  ;
    }
    //ADD SOME CAMPGROUND  //
    data.forEach((seed)=>{
      Campground.create(seed,(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            console.log("a camp added");
            ////CREATE A COMMENT 
            Comment.create({
                text:"this place is so good man !",
                author:"yunus",
            },(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("a comment created");
                }
            })
        }
    });
});
    
   
});  

};
module.exports=seedDB;
    
 
    
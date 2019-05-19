let  mongoose=require("mongoose");



let campgroundSchema = new mongoose.Schema({
   name: String,
   price:String,
   image: String,
   createdTime: 
   { type: Date, 
   default: Date.now },
   description: String,
   author:{
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username:String,
   },
   
   comments:[
      {
         type:mongoose.Schema.Types.ObjectId,
          ref:"Comment" // NAME OF THE MODEL
         
      }
      ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
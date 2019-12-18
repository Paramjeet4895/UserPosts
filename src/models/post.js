const mongoose=require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
     banner:{
        type:String,
    },
    description:{
        type:String,
        required:true
    }, 
  userId: {
       type:mongoose.Schema.Types.Number,
       required: true,
       ref: 'User'
    },
   upload:{
        type:String,
        required: true
    }
},{
    timestamps:true
})



const Post=mongoose.model('Post',postSchema)
module.exports=Post
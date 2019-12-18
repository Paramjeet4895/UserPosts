const express=require('express')
const router=new express.Router()
const Post= require('../models/post')
const mongoose=require('mongoose')
const User=require('../models/user')
const bodyParser = require('body-parser').json();
const multer=require('multer')
//const fileupload=require('express-fileupload')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload =multer({storage:storage})

/////////////ADD///////////////
router.post('/posts/:uid',upload.single('upload'),async(req,res) => {
   console.log(req.file)
    const post=new Post({
        title:req.body.title,
         banner:req.body.banner,
         description:req.body.description,
         upload:req.file.path,
         userId:req.params.uid
    })
   
    try{
        await post.save()
        res.status(201).send(post)
    }catch(e){
        res.status(400).send(e)
    }
    
 })

///////////READ///////////
router.get('/user/:uid/posts',async(req,res)=>{
    const uid=req.params.uid
    try{
        const post=await Post.find({userId:uid})
       if(!post[0]){
            return res.status(404).send()
        }
        res.send()
    }catch(e){
        res.status(500).send(e)
    }
})


/////READ ALL POSTS
router.get('/posts',async(req,res)=>{
    try{
        const post=await Post.find()
        if(!post[0]){
            return res.status(404).send()
        }
        res.send(post)
    }catch(e){
        res.status(500).send(e)
    }
})


// //////////////UPDATE////////////////
router.post('/user/:uid/posts/:id',upload.single('upload'),async(req,res) =>{
    const uid=req.params.uid
    //console.log(req.body)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','banner','description']
    const isValidOperation =updates.every((update)=> allowedUpdates.includes(update))
    //console.log(updates)
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates'})
    }
   // try{
        const post= await Post.findOne({_id:req.params.id,userId:uid})
        console.log(post)
       if(!post){
        return res.status(404).send()
   }
   updates.forEach((update)=>post[update]=req.body[update])
   post.upload=req.file.path
    await post.save()
    res.send(post)
    
    //}catch(e){
   //  res.status(400).send(e)
  //  }


})


////////////DELETE//////////////////
router.delete('/user/:uid/posts/:id',async(req,res)=>{
    try{
        const uid=req.params.uid
      const post=await Post.findOneAndDelete({_id:req.params.id,userId:uid})
      if(!post){
          return res.status(404).send()
      }
      res.send(post)
    }catch(e){
        return res.status(500).send()
    }
})

module.exports=router
const express=require('express')
const router=new express.Router()
const User= require('../models/user')
const Post=require('../models/post')
router.post('/users',async(req,res)=>{

    const user=new User(req.body)
    try{
        await user.save()
         res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

///////////READ///////////
router.get('/users',async(req,res)=>{
  
    try{
        const user=await User.find({})
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})


router.get('/users/:id',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})



////////UPDATE////////////
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'phone', 'email']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
         return res.status(400).send({ error: 'Invalid Updates' })
    }
   
    try {
        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)

    } catch (e) {
        res.status(400).send(e)
    }


})


////////////DELETE//////////////////
router.delete('/users/:id',async(req,res)=>{
    try{
      //await Post.findByIdAndDelete({userId:req.params.id})
      const user=await User.findByIdAndDelete({_id:req.params.id})
      if(!user){
          return res.status(404).send()
      }
      res.send(user)
    }catch(e){
        return res.status(500).send()
    }
})



module.exports=router
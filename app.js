const express = require('express');
const app=express(); 
const PORT=4000;
const cors = require('cors') //while sharing data from front and backend


//require database models
const User = require('./models/user')
const Posts=require('./models/posts')

const mongoose = require('mongoose');
mongoose.set('strictQuery',false);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
app.use(cors());//cross origin resource sharing

const dbURL= "mongodb://localhost:27017/foodie"

mongoose.connect(dbURL).then(()=>{
    console.log("Connected to database");
})

app.post('/',(req, res)=>{
User.findOne({email:req.body.email},(err,userData)=>{
    if(userData){
        if(req.body.password==userData.password){
            res.send({message:'login successfull'})
        }
        else{
            res.send({message:'login failed'})
        }
    }
    else{
        res.send({message:'no account seems to be matching with your email'})
    }
})
})

app.post('/signup',async(req,res)=>{
    User.findOne({email:req.body.email}||{number:req.body.number},(err,userData)=>{
        if(userData){
            res.send({message:"User already exists"})
        }
        else{
            const data = new User({
                name:req.body.name,
                email:req.body.email,
                number:req.body.number,
                password:req.body.password,
            })
            try{
                data.save()
                res.send({message:'User registered successfully'})
            }
            catch(e){
                res.send(e)
            }
        }
    })
})
app.get('/posts',async(req,res)=>{
try {
const posts=await Posts.find()
res.send(posts)

} catch (error) {
    console.log(err);
}
})
app.get('/users',async(req,res)=>{
    try {
    const users=await User.find()
    res.send(users)
    
    } catch (error) {
        console.log(err);
    }
    })
app.get('/posts/:id',async(req,res)=>{
    const {id} =req.params
    try {
        const posts= await Posts.findById(id)
        res.send(posts)
    } catch (error) {
        res.send(error)
    }
})
app.post('/add-posts',async(req,res)=>{
let postData=new Posts({
    author:req.body.author,
    title:req.body.title,
    summary:req.body.summary,
    image:req.body.image,
    location:req.body.location,
})
try{
    await postData.save()
    res.send({message:"Post added successfully"})

}catch(err){
    res.send({message:" invalid post"})
}
})

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})
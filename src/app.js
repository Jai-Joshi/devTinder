const express = require('express');
const {authAdmin} = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async(req, res) =>{

   console.log('req.body', req.body);
     const user = new User(req.body);

     try{
        await user.save();
        res.send("User signed up successfully");
     }catch(err){
        res.send("Error signing up user: " + err);  
     }
})

// Get User By Email

app.get("/getUser", async(req, res)=>{

   const userEmail = req.query.Email
   
   try{
      const user = await User.findOne({emailId: userEmail});

      if(user.length ===0){
         res.status(404).send("User not found");
      }else{
         res.send(user)
      }
   }catch(err){
      res.status(500).send("Something went wrong while fetching user details");
   }
})

app.get("/feed", async(req, res)=>{
   try{
      const users = await User.find({});
      res.send(users);
   }catch(err){
      res.status(500).send("Something went wrong while fetching user details");
   }
});

app.delete("/deleteUser", async (req, res)=>{
   const userId = req.body.userId;
   console.log("Deleting user with ID: " + userId);

try{
   const user = await User.findByIdAndDelete(userId);
   if(!user){
      res.status(404).send("User not found");
   }else{
      res.send("User deleted successfully");
   }} catch(err){
      res.status(500).send("Something went wrong while deleting user");
   }     
})

app.patch("/updateUser", async (req, res)=>{
   const userId = req.body.userId;
   const data = req.body;

   try{
      const user = await User.findByIdAndUpdate(userId, data);

      if(!user){
         res.status(404).send("User not found");
      }else{
         res.send("User updated successfully");
         console.log("User updated successfully", user);

      }
   } catch(err){
      res.status(500).send("Something went wrong while updating user");
   }
})

connectDB()
.then(() => {
    console.log("Database connected successfully");
    app.listen(3333, () => {
    console.log("Server is running on port 3333");
});
})
.catch((err) => {
    console.log("Error connecting to database:", err);
});


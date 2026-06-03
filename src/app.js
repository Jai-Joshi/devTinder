const express = require('express');
const { userAuth } = require("./middlewares/auth");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validate");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


app.use(cookieParser());

app.use(express.json());

app.post("/signup", async (req, res) => {

   try {
      console.log('req.body', req.body);

      validateSignUpData(req);

      const { firstName, lastName, email, password } = req.body;
      console.log('body', firstName, lastName, email, password);

      const passwordHash = await bcrypt.hash(password, 10);

      console.log('passwoord', passwordHash);

      const user = new User(
         {
            firstName,
            lastName,
            email,
            password: passwordHash
         }
      );

      await user.save();
      res.send("User signed up successfully");
   } catch (err) {
      res.send("Error signing up user: " + err);
   }
})

app.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });

      if (!user) {
         res.send("Invalid email or password");
      }

      const isPassValid = await user.validatePassword(password);

      if (isPassValid) {
         const token = await user.getJWT();
         res.cookie("token", token,{expires: new Date(Date.now() + 3600000)})
         res.send("User logged in successfully");
      }
      else {
         throw new Error("Invalid email or password");
      }
   } catch (err) {
      res.send("Error logging in user: " + err);
   }

})

app.post('/sendConnectinoRequest', userAuth, async (req, res) => {
   const user = req.user;

   console.log('sending connection request');

   res.send(user.firstName + " " + user.lastName + " sent a connection request");
})
   

app.get("/profile", userAuth, async (req, res) => {

   try {
      const user = req.user;

      res.send(user);
   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }

})

app.get("/getUser", async (req, res) => {

   const userEmail = req.query.Email

   try {
      const user = await User.findOne({ emailId: userEmail });

      if (user.length === 0) {
         res.status(404).send("User not found");
      } else {
         res.send(user)
      }
   } catch (err) {
      res.status(500).send("Something went wrong while fetching user details");
   }
})

app.get("/feed", async (req, res) => {
   try {
      const users = await User.find({});
      res.send(users);
   } catch (err) {
      res.status(500).send("Something went wrong while fetching user details");
   }
});

app.delete("/deleteUser", async (req, res) => {
   const userId = req.body.userId;
   console.log("Deleting user with ID: " + userId);

   try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
         res.status(404).send("User not found");
      } else {
         res.send("User deleted successfully");
      }
   } catch (err) {
      res.status(500).send("Something went wrong while deleting user");
   }
})

app.patch("/updateUser/:userId", async (req, res) => {
   const userId = req.params?.userId
   const data = req.body;

   try {

      const Allowed_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
      const isUpdateAllowed = Object.keys(data).every((update) => Allowed_UPDATES.includes(update));

      if (!isUpdateAllowed) {
         throw new Error("Invalid updates! Only photoUrl, about, gender, age, and skills can be updated.");
      }

      const user = await User.findByIdAndUpdate(userId, data);

      if (!user) {
         res.status(404).send("User not found");
      } else {
         res.send("User updated successfully");
         console.log("User updated successfully", user);

      }
   } catch (err) {
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


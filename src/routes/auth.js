const express = require('express');
const authRouter = express.Router();

const { validateSignUpData } = require('../utils/validate');
const User = require('../models/User');
const bcrypt = require('bcrypt');   

authRouter.post("/signup", async (req, res) => {

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

authRouter.post("/login", async (req, res) => {
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

module.exports = authRouter;
const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditData } = require('../utils/validate');

profileRouter.get("/profile/view", userAuth, async (req, res) => {

   try {
      const user = req.user;

      res.send(user);
   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }

})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
   try {
      if (!validateEditData(req)) {
         throw new Error("Invalid fields in request body");
      }
      const loggedInUser = req.user;
      console.log("logged in user before update", loggedInUser);
      Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
      console.log("logged in user after update", loggedInUser);
      await loggedInUser.save();

      res.json({
         message: `${loggedInUser.firstName} ${loggedInUser.lastName}'s profile updated successfully`,
         data: loggedInUser
      });
   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
         throw new Error("Both current and new passwords are required");
      }

      const loggedInUser = req.user;

      const isCurrentPasswordValid = await loggedInUser.validatePassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
         throw new Error("Current password is incorrect");
      }

      loggedInUser.password = newPassword;
      await loggedInUser.save();

      res.send("Password updated successfully");

   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }
})

module.exports = profileRouter;
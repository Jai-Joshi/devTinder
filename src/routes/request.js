const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
   try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
         throw new Error(`Status must be one of ${allowedStatuses.join(", ")}`);
      };

      const toUser = await User.findById(toUserId);
      if (!toUser) {
         throw new Error("User with the provided toUserId does not exist");
      }

      if (fromUserId.equals(toUserId)) {
         throw new Error("You cannot send a connection request to yourself");
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
         $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }
         ]
      });

      if (existingConnectionRequest) {
         throw new Error("A connection request already exists between these users");
      }

      const connectionRequest = new ConnectionRequestModel({
         fromUserId,
         toUserId,
         status
      });

      const data = await connectionRequest.save();

      res.json({
         message: `Connection request ${status} successfully sent to user with id ${toUserId}`,
         data
      })

   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }

});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
   try {
      const { status, requestId } = req.params;
      const loggedInUserId = req.user._id;

      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
         throw new Error(`Status is invalid.`);
      }

      const conectionRequest = await ConnectionRequestModel.findOne({
         _id: requestId,
         toUserId: loggedInUserId,
         status: "interested"
      });

      if (!conectionRequest) {
         throw new Error("No connection request found for the given requestId and logged-in user");
      }

      conectionRequest.status = status;
      const data = await conectionRequest.save();

      res.json({
         message: `Connection request ${status} successfully.`,
         data
      })


   } catch (err) {
      res.status(400).send("Error :" + err.message);
   }
});
module.exports = requestRouter;
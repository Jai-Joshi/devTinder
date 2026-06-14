const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');

const USER_SAFE_FIELDS = 'firstName lastName about photoUrl skills';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Implementation for fetching received connection requests

        const connectionRequests = await ConnectionRequestModel.find
        ({ toUserId: loggedInUser._id,
           status: "interested" 
         }).populate('fromUserId', USER_SAFE_FIELDS);

        res.json({
            message: "Received connection requests fetched successfully",
            data: connectionRequests
        });
    } catch (err) {
        res.status(400).send("Error :" + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId toUserId', USER_SAFE_FIELDS);

        const data = connectionRequests.map(request => {
            if(request.fromUserId._id.equals(loggedInUser._id)) {
                return request.toUserId;
            } else {
                return request.fromUserId;
            }
        });

        res.json({
            message: "User connections fetched successfully",
            data: data
        });

    }catch(err){
        res.status(400).send("Error :" + err.message);
    }
});

module.exports = userRouter;
const jwt = require('jsonwebtoken');
const User = require("../models/user");


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;;
        if (!token) {
            throw new Error("No token found, please login again");
        }

        const decodeObj = await jwt.verify(token, "JJ@123");
        console.log('decodeObj', decodeObj);

        const { userId } = decodeObj;
        console.log('id', userId);

        const user = await User.findById(userId);
        console.log('user', user);

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}



module.exports = { userAuth };
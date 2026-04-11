const mongoose = require('mongoose');

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://admin:Jaimongo123@jaicluster.vmt0dhp.mongodb.net/devTinder")
}

module.exports = connectDB
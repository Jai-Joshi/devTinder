const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minlength: 2
    },

    lastName: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    age: {
        type: Number,
        min: 18
    },

    gender: {
        type: String,
        validate(value) {
            if (!["Male", "Female", "Other"].includes(value)) {
                throw new Error("Gender must be Male, Female, or Other");
            }
        }
    },

    about: {
        type: String,
        default: "This is a default about me section. Please update it to tell others about yourself!"
    },

    photoUrl: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png"
    },

    skills: {
        type: [String],
        validate(value){
            if(value.length > 5){
                throw new Error("You can only add up to 5 skills");
            }
        }
    }
}, { timestamps: true })



module.exports = mongoose.model("User", userSchema)
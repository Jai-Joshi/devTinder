const mongoose = require('mongoose');
const validator = require('validator');
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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol");
            }
        }
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
        default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Picture.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL for photo");
            }
        }
    },

    skills: {
        type: [String],
        validate(value) {
            if (value.length > 5) {
                throw new Error("You can only add up to 5 skills");
            }
        }
    }
}, { timestamps: true })



module.exports = mongoose.model("User", userSchema)
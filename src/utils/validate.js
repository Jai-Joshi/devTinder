const validator = require("validator");

const validateSignUpData = (req) =>{ 
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

}

const validateEditData = (req) =>{
    const allowedFields = ["firstName", "lastName", "email", "gender", "age", "about", "skills","photoUrl"];

    const isEditAllowed  = Object.keys(req.body).every(field => allowedFields.includes(field));

    return isEditAllowed;
}
 
module.exports = {
    validateSignUpData,
    validateEditData
}
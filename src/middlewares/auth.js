const authAdmin =  (req, res, next) =>{
    console.log('Entered in admin route');

    const isAdminAuthorized = "abc123";

    if(!isAdminAuthorized === "abc123"){
        res.send("Admin is not authorized");
    }else{
        next();
    }    
}

module.exports = {authAdmin};
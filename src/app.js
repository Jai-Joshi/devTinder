const express = require('express');
const {authAdmin} = require("./middlewares/auth");
const app = express();

app.use("/admin", authAdmin)

app.get("/admin/getAllUsers", (req, res) => {
    res.send("User Data Sent");
});


app.use("/Namaskar", (req, res) => {
    res.send("Namaskar World");
});

app.get("/User", (req,res) =>{
    console.log("Query Parameters:", req.query);
    console.log("getting user");
    res.send("Got the user",{name: "JJ"});
})

app.get("/User/:id", (req,res) =>{
    console.log("Path Parameters:", req.params);
    console.log("getting user");
    res.send("Got the user",{name: "JJ"});
})

app.post("/User", (req,res) =>{
    console.log("creating user");
    res.send("Created the user");
})

app.delete("/User", (req, res) =>{
    console.log("deleting user");
    res.send("Deleted the user");
})

app.get("/getError", (req,res) =>{
    throw new Error("This is an error");
    res.send("This will not be sent");
})

app.use("/", (req, res) => {
    res.send("Hello World");
});

app.use("/", (err, req, res, next) => {
    if(err){
    res.status(500).send("Something went wrong: " + err.message);
    }
});

app.listen(3333, () => {
    console.log("Server is running on port 3333");
});
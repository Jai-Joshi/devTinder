const express = require('express');

const app = express();

app.use("/Namaskar", (req, res) => {
    res.send("Namaskar World");
});

app.get("/User", (req,res) =>{
    console.log("getting user");
    res.send("Got the user",{"name": "JJ"});
})

app.post("/User", (req,res) =>{
    console.log("creating user");
    res.send("Created the user");
})

app.delete("/User", (req, res) =>{
    console.log("deleting user");
    res.send("Deleted the user");
})

app.use("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3333, () => {
    console.log("Server is running on port 3333");
});
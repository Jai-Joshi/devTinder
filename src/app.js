const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request'); 
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
   .then(() => {
      console.log("Database connected successfully");
      app.listen(3333, () => {
         console.log("Server is running on port 3333");
      });
   })
   .catch((err) => {
      console.log("Error connecting to database:", err);
   });


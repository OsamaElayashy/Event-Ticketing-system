
const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require('cookie-parser')
const cors = require("cors");
const dotenv= require('dotenv').config();

const app = express();

const eventsRouter = require('./Routes/event.js');
const userRouter = require("./Routes/user");
const authRouter = require("./Routes/auth.js");
const authenticationMiddleware=require('./middleware/authenticationMiddleware')

app.use('/events', eventsRouter);
app.use(authenticationMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);




app.use("/api/v1", authRouter);


app.use("/api/v1/users", userRouter);

const db_name = dotenv.DB_NAME;
// * Cloud Connection
// const db_url = `mongodb+srv://TestUser:TestPassword@cluster0.lfqod.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// * Local connection
const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1

// ! Mongoose Driver Connection



mongoose
  .connect(db_url)
  .then(() => console.log("mongoDB connected"))
  .catch((e) => {
    console.log(e);
  });

app.use(function (req, res, next) {
  return res.status(404).send("404");
});
app.listen(process.env.PORT||4000, () => console.log("server started"));

const auth = require('./Routes/auth.js');
app.use('/api/v1', auth);
const event = require('./Routes/event.js');
app.use('/api/v1', event);
const booking = require('./Routes/booking.js');
app.use('/api/v1', booking);
const user = require('./Routes/user.js');
app.use('/api/v1', user);

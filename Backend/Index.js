require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const errormiddleware = require("./Middlewares/errormiddleware");
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser");
app.use(express.json());
const PORT = process.env.PORT;
const Mongo_Url = process.env.MONGO_URL;
const authRoute = require("./Router/AuthRouter");
const GoalRouter = require("./Router/GoalRouter");

//mongoDB connection
mongoose
  .connect(Mongo_Url)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// routes
app.use("/api/auth", authRoute);
app.use("/api/goals", GoalRouter);

app.use(errormiddleware);
app.listen(PORT, () => {
  console.log("Server running on port 8000");
});


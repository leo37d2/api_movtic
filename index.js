const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const movieRoute = require("./routers/movie");
const foodRouter = require("./routers/food");
const singer_actorRouter = require("./routers/singer_actor");
const userRouter = require("./routers/user");
const billRouetr = require("./routers/bill");
const sportRouter = require("./routers/sport");
const eventRouter = require("./routers/event");
const authRouter = require("./routers/auth");

const app = express();

dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(console.log("Ket noi csdl thanh cong"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/movie", movieRoute);
app.use("/api/food", foodRouter);
app.use("/api/sa", singer_actorRouter);
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/bill", billRouetr);
app.use("/api/sport", sportRouter);

app.listen(process.env.PORT || 5000, () => console.log("backend dang chay!"));

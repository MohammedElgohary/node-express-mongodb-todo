require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();

/*-------- Database Connections --------*/
const db = require("./connections/index");

/*-------- Config --------*/
app.set("PORT", process.env.PORT || 5000);

// Globals
global.sendError = (message = null, status = null) => {
  let err = new Error(message ? message : "");

  if (status) {
    err.status = status;
  }

  return err;
};

global.db = db;
/*--------- Middleware ---------*/
// static files
app.use(
  "/uploads",
  express.static(
    path.join(path.dirname(process.mainModule.filename), "uploads")
  )
);

// security
app.use(cors());
app.use(helmet());

// logger
app.use(morgan("dev"));

// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*-------- Routes --------*/
app.use("/auth", require("./routes/v1/auth.routes"));
app.use("/users", require("./routes/v1/user.routes"));

/*-------- Errors --------*/
app.use((req, res, next) => next(sendError("Not Found !", 404))); // 404

app.use((err, req, res, next) => {
  let error = new Error(err?.message || "Server Error !");
  error.status = err?.status || 501;

  console.log(error);
  const success = error.status.toString().startsWith("2");

  if (err?.code === 11000) {
    error.message = "email already exists !";
    error.status = 400;
  }

  res.status(error.status).send({
    message: error.message,
    status: error.status,
    success,
  });
}); // 501

process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
}); // un Handled Catch

process.on("unhandledRejection", (e) => {
  console.log(e);
  process.exit(1);
}); // un Handled Promise

module.exports = app;

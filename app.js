var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
let applyRouter = require("./routes/apply");
var userController = require("./controllers/user");
const passport = require("passport");
const mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/test";
// var url =
//   "mongodb://jobPortal:jobPortal@cluster0-shard-00-00-ygyti.mongodb.net:27017,cluster0-shard-00-01-ygyti.mongodb.net:27017,cluster0-shard-00-02-ygyti.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const passportConfig = require("./config/passport");
const db = mongoose.connection;

mongoose.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
});

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: "topsecret",
//   cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
//   store: new MongoStore({
//     mongooseConnection:db
//   })
// }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "topsecret",
    cookie: { maxAge: 86400000 }, // two weeks in milliseconds
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/appliedApplications", userController.appliedApplications);
app.use("/apply", applyRouter);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
// app.get('/loggedIn',userController.logDone);
app.get("/logout", userController.logoutDone);
// app.get('/apply',userController.applyNow);
// TODO rishi

app.get("/button1", userController.clickButton1);
app.get("/button2", userController.clickButton2);
app.use("/", indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

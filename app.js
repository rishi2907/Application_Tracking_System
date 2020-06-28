var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const multer = require("multer");
const flash = require("express-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const fileUpload = require('express-fileupload');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
let applyRouter = require("./routes/apply");
let multerRouter = require("./routes/multer");
var userController = require("./controllers/user");
const passport = require("passport");
const mongoose = require("mongoose");
var MongoClient = require("mongodb").MongoClient;
//var url = "mongodb://localhost:27017/test";
var url =  "mongodb://jobPortal:jobPortal@cluster0-shard-00-00-ygyti.mongodb.net:27017,cluster0-shard-00-01-ygyti.mongodb.net:27017,cluster0-shard-00-02-ygyti.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const passportConfig = require("./config/passport");
const db = mongoose.connection;

mongoose.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/public/attachments/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
  // fileFilter: imageFilter,
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var app = express();
app.use(fileUpload());
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
app.get("/multer", async function (req, res, next) {
  res.render("test");
});

app.post(
  "/multer/upload-profile-pic",
  upload.single("profile_pic"),
  (req, res) => {
    console.log(Object.keys(req.body));
    console.log("----------------------------------------------------------");
    console.log(req.file);
    // 'profile_pic' is the name of our file input field in the HTML form

    //   console.log(req);
    // upload(req, res, function (err) {
    //   // req.file contains information of uploaded file
    //   // req.body contains information of text fields, if there were any

    //   if (req.fileValidationError) {
    //     return res.send(req.fileValidationError);
    //   } else if (!req.file) {
    //     return res.send("Please select an image to upload");
    //   } else if (err instanceof multer.MulterError) {
    //     return res.send(err);
    //   } else if (err) {
    //     return res.send(err);
    //   }

    //   // Display uploaded image for user validation
    //   res.send(
    //     `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
    //   );
    // });
    res.send(
      `You have uploaded this image: <hr/><img src="${
      "/attachments/" + req.file.filename
      }" width="500"><hr /><a href="./">Upload another image</a>`
    );
  }
);

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

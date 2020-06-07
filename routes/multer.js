var express = require("express");
const multer = require("multer");
var router = express.Router();
const JobSchema = require("../models/JobSchema");
const JobDataSchema = require("../models/JobData");
var path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("test");
});

router.post("/upload-profile-pic", (req, res) => {
  console.log(req);
  // 'profile_pic' is the name of our file input field in the HTML form
  //   let upload = multer({
  //     storage: storage,
  //     fileFilter: imageFilter,
  //   }).single("profile_pic");
  //   //   console.log(req);
  //   upload(req, res, function (err) {
  //     // req.file contains information of uploaded file
  //     // req.body contains information of text fields, if there were any

  //     if (req.fileValidationError) {
  //       return res.send(req.fileValidationError);
  //     } else if (!req.file) {
  //       return res.send("Please select an image to upload");
  //     } else if (err instanceof multer.MulterError) {
  //       return res.send(err);
  //     } else if (err) {
  //       return res.send(err);
  //     }

  //     // Display uploaded image for user validation
  //     res.send(
  //       `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
  //     );
  //   });
});

// router.post("/submitForm", async function (req, res, next) {
//   console.log(req);

//   let jobId = req.body.jobid;
//   let applicationdata = req.body;
//   delete applicationdata["jobid"];

//   let data = {
//     jobID: jobId,
//     emailID: req.user.email,
//     formData: JSON.stringify(applicationdata),
//     status: "Applied",
//     adminStatus: "Applied",
//   };

//   let dataObj = new JobDataSchema(data);
//   dataObj.save();

//   res.json({ username: req.user.email });
// });

// router.get("/submit", async function (req, res, next) {
//   req.flash("success", { msg: "Your Application submitted Successfully" });
//   res.redirect("/");
// });

module.exports = router;

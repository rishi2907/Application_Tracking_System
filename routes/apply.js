var express = require("express");
var router = express.Router();
const JobSchema = require("../models/JobSchema");
const JobDataSchema = require("../models/JobData");
const multer = require("multer");
const path = require("path");

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

let fieldName = [{ name: "Upload Passport Size Photo" }];

/* GET home page. */
router.get("/jobId/:jobId", async function (req, res, next) {
  let result;
  console.log(req.user);
  result = await JobSchema.findById(req.params.jobId).then((result) => {
    return result;
  });
  console.log("testing rishi::::::::::::::::" + result);
  if (req.user) {
    let applyCheck = await JobDataSchema.findOne({
      emailID: req.user.email,
      jobID: req.params.jobId,
    });
    if (applyCheck) {
      req.flash("errors", {
        msg: "You have already applied for this application",
      });
      return res.redirect("/");
    }
    console.log(JSON.parse(result.formdata));
    jobFields = JSON.parse(result.formdata);
    fieldName = [];
    for (findFile in jobFields) {
      if (jobFields[findFile]["type"] == "file") {
        fieldName.push({ name: findFile });
      }
    }
    console.log(fieldName);
    res.render("apply", {
      name: req.user.name,
      result: JSON.stringify(result),
      formdata: JSON.parse(result.formdata),
    });
  } else {
    req.flash("errors", { msg: "Login Required" });
    res.redirect("/");
  }
});

router.post("/submitForm", upload.fields(fieldName), async function (
  req,
  res,
  next
) {
  console.log(req);
  let applicationdata = {};
  for (field in req.body) {
    // names.split(",");
    value = req.body[field];
    let arr = field.split("$");
    let obj = { type: arr[1], value: value };
    applicationdata[arr[0]] = obj;
  }
  let jobId = req.body.jobid;
  // let applicationdata = req.body;
  delete applicationdata["jobid"];
  for (files in fieldName) {
    // names.split(",");
    console.log(files);
    value = req.files[fieldName[files].name][0].path;
    let arr = fieldName[files].name;
    let obj = { type: "file", value: value };
    applicationdata[arr] = obj;
  }
  console.log(applicationdata);

  let data = {
    jobID: jobId,
    emailID: req.user.email,
    formData: JSON.stringify(applicationdata),
    status: "Applied",
    adminStatus: "Applied",
  };

  let dataObj = new JobDataSchema(data);
  dataObj.save();
  req.flash("success", { msg: "Your Application submitted Successfully" });
  res.redirect("/");
  // res.json({ username: req.user.email });
});

router.get("/submit", async function (req, res, next) {
  req.flash("success", { msg: "Your Application submitted Successfully" });
  res.redirect("/");
});

module.exports = router;

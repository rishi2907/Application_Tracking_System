var express = require("express");
var router = express.Router();
// const JobSchema = require("../models/JobSchema");
const JobDataSchema = require("../models/JobData");
/* GET home page. */
router.get("/jobId/:jobId", async function (req, res, next) {
  console.log("RISHI:::::::::::::::::::::::::::::" + req.params.jobId);
  let result;
  result = await JobSchema.findById(req.params.jobId).then((result) => {
    return result;
  });
  console.log("testing rishi::::::::::::::::" + result);
  if (req.user) {
    res.render("apply", {
      name: req.user.name,
      result: JSON.stringify(result),
      formdata: JSON.parse(result.formdata),
    });
  } else {
    res.render("index", {
      name: "login_req",
    });
  }
});

router.post("/submitForm", async function (req, res, next) {
  console.log(req);

  let data = {
    jobID: req.body.jobid,
    emailID: req.user.email,
    formData: req.body,
    status: "applied",
    adminStatus: "applied",
  };

  const dataObj = new JobDataSchema(data);
  dataObj.save();

  res.json({ username: req.user.email });
});

router.get("/submit", async function (req, res, next) {
  req.flash("success", { msg: "Your Application submitted Successfully" });
  res.redirect("/");
});

module.exports = router;

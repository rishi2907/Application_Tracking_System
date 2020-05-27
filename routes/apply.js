var express = require("express");
var router = express.Router();
const JobSchema = require("../models/JobSchema");
const JobDataSchema = require("../models/JobData");
/* GET home page. */
router.get("/jobId/:jobId", async function (req, res, next) {
  let result;
  console.log(req.user);
  result = await JobSchema.findById(req.params.jobId).then((result) => {
    return result;
  });
  console.log("testing rishi::::::::::::::::" + result);
  if (req.user) {
    let applyCheck = await JobDataSchema.findOne({emailID: req.user.email, jobID:req.params.jobId});
    if(applyCheck){
      req.flash('errors', { msg: 'You have already applied for this application' });
      return res.redirect('/');
    }
    res.render("apply", {
      name: req.user.name,
      result: JSON.stringify(result),
      formdata: JSON.parse(result.formdata),
    });
  } else {
    req.flash('errors', { msg: 'Login Required' });
    res.redirect('/');
  }
});

router.post("/submitForm", async function (req, res, next) {
  console.log(req);

  let jobId = req.body.jobid;
  let applicationdata = req.body;
  delete applicationdata["jobid"];

  let data = {
    jobID: jobId,
    emailID: req.user.email,
    formData: JSON.stringify(applicationdata),
    status: "Applied",
    adminStatus: "Applied",
  };

  let dataObj = new JobDataSchema(data);
  dataObj.save();

  res.json({ username: req.user.email });
});

router.get("/submit", async function (req, res, next) {
  req.flash("success", { msg: "Your Application submitted Successfully" });
  res.redirect("/");
});

module.exports = router;

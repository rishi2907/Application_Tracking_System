var express = require("express");
var router = express.Router();
const JobSchema = require("../models/JobSchema");

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
  console.log("RISHI:::::::::::::::::::::::::::::");
  console.log(req);
  // let result;
  // result = await JobSchema.findById(req.params.jobId).then((result) => {
  //   return result;
  // });
  // console.log("testing rishi::::::::::::::::" + result);
  res.json({ username: "Flavio" });
  // req.flash("success", { msg: "Job Successfully posted" });
  // res.redirect("/admin");

  // if (req.user) {
  //   res.json({ username: "Flavio" });
  // }
});
router.get("/submit", async function (req, res, next) {
  req.flash("success", { msg: "Your Application submitted Successfully" });
  res.redirect("/");
});

module.exports = router;

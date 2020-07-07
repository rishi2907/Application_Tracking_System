var express = require("express");
var router = express.Router();
var { getJobCard } = require("./JobCard");
const JobSchema = require("../models/JobSchema");

/* GET home page. */
router.get("/", async function (req, res, next) {
  var data = [];
  var tempData = await JobSchema.find({ openingtype: "technical", status: "open" });

  var today = new Date();
  var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();



  for (i = 0; i < tempData.length; i++) {
    if (new Date(tempData[i].lastdate) < new Date(todayDate)) {
      tempData[i].status = "closed";
      tempData[i].save();

    }
    else {
      data.push(tempData[i]);
    }

  }

  // console.log(tempData);
  // console.log("--------------------------------------------");
  // console.log(data);


  if (req.user) {
    res.render("index", {
      name: req.user.name,
      Jobdata: data,
    });
  } else {
    res.render("index", {
      name: "login_req",
      Jobdata: data,
    });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var {getJobCard}= require('./JobCard');
const JobSchema = require('../models/JobSchema');

/* GET home page. */
router.get('/',async function(req, res, next) {
 var data = await JobSchema.find({openingtype:"technical", status:"open"});
 if(req.user){
  res.render('index', {
    name: req.user.name,
    Jobdata: data,
  });

 }else{
  res.render('index', { 
    name: "login_req",
    Jobdata: data,
 });

}
  
   

});

module.exports = router;

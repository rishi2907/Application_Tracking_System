var express = require('express');
var router = express.Router();
var {getJobCard}= require('./JobCard');

/* GET home page. */
router.get('/', function(req, res, next) {
 if(req.user){
  res.render('index', {
    name: req.user.name,
    JobCard : getJobCard,
    tag: 1
  });

 }else{
   console.log("2 called");
  res.render('index', { 
    name: "login_req",
    JobCard : getJobCard,
    tag: 1
 });

}
  
   

});

module.exports = router;

var express = require('express');
var router = express.Router();
var {getJobCard}= require('./JobCard');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("home clicked");
  // console.log(req.user.name);
 if(req.user){
   console.log("1 called");
  res.render('index', {
    name: req.user.name,
    loggedIn:true,
    JobCard : getJobCard
  });

 }else{
   console.log("2 called");
  res.render('index', { 
    loggedIn:false,
    name:"anonymous",
    JobCard : getJobCard
 });

}
  
   

});

module.exports = router;

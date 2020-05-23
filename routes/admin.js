const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const JobSchema = require('../models/JobSchema');

// router.get('/showApplications/pending', adminController.showApplication);
router.get('/pending/:jobID', adminController.showApplication);
router.get('/showJobs/pending', adminController.showJob);
router.post('/postjob', adminController.postJobForm);
router.get('/postjob', adminController.getJobForm);
router.get('/register', adminController.getSignup);
router.get('/showChart', adminController.showChart);
router.post('/register', adminController.postSignup);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/',async function(req, res, next) {
  if(req.user){
    // var data = await JobSchema.find({status:"open"});
    var data = await JobSchema.find();
    res.render('admin/admin',
    {
      name: req.user.name,
      usertype: req.user.usertype,
      Jobdata: data
     });
  }
  else{
      res.redirect('/admin/login');
      
 }
 });

module.exports = router;

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const JobSchema = require('../models/JobSchema');
const JobData = require('../models/JobData');

// router.get('/showApplications/pending', adminController.showApplication);
router.get("/verifyAdminToken/:token", adminController.verifyAdminToken);
router.get('/selected/:jobID', adminController.selectedApplication);
router.get('/declareResult/:jobID', adminController.declareResult);
router.get('/accept/:appID', adminController.acceptApplication);
router.get('/reject/:appID', adminController.rejectApplication);
router.get('/pending/:jobID', adminController.showApplication);
router.get('/showJobs/pending', adminController.showJob);
router.post('/postjob', adminController.postJobForm);
router.get('/postjob', adminController.getJobForm);
router.get('/register', adminController.getSignup);
router.get('/showChart', adminController.showChart);
router.post('/register', adminController.postSignup);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/download/:jobID', adminController.download);
router.get('/selectedDownload/:jobID', adminController.selectedDownload);
router.get('/',async function(req, res, next) {
  if(req.user){
    // var data = await JobSchema.find({status:"open"});
    var data = await JobSchema.find();
    var totalJobs = await JobSchema.count();
    var totalApplications = await JobData.count();
    res.render('admin/admin',
    {
      name: req.user.name,
      usertype: req.user.usertype,
      Jobdata: data,
      totalJobs: totalJobs,
      totalApplications: totalApplications
     });
  }
  else{
      res.redirect('/admin/login');
      
 }
 });

module.exports = router;









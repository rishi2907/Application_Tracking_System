const validator = require('validator');
const passport = require('passport');
const Admin = require('../models/Admin');
const JobSchema = require('../models/JobSchema');
const JobData = require('../models/JobData');


exports.showApplication = async (req, res) => {
  if(req.user){
    var jobID = req.params.jobID;  
    var jobData  = await JobData.find({jobID: jobID, adminStatus: "Applied" });
   
    var result = [];

    for(var i=0; i<jobData.length; i++){
      var parsedData = JSON.parse(jobData[i].formData);

      var objData = {
        _id: jobData[i]._id,
        jobID: jobData[i].jobID,
        emailID: jobData[i].emailID,
        formData: parsedData
      }

      result.push(objData);

    }

    console.log(result[0].formData.Name.value);
   
    res.render('admin/showApplication',
    {
      name: req.user.name,
      usertype: req.user.usertype,
      applicationData: result
     });

  }
  else{
      res.redirect('/admin/login');    
 }

};



exports.showJob = async (req, res) => {
  if(req.user){
    var data = await JobSchema.find({
      $or: [
        { status: { $eq: 'open' } },
        { status: { $eq: 'closed' } }
      ]
    });
    console.log(data);
    res.render('admin/showJob',
    {
      name: req.user.name,
      usertype: req.user.usertype,
      Jobdata: data
     });
  }
  else{
      res.redirect('/admin/login');    
 }

};


exports.postJobForm = async (req, res) => {
  
  var data = {
    jobtitle: req.body.jobtitle,
    salary: req.body.salary,
    experience: req.body.experience,
    eligibility: req.body.elegibility,
    lastdate: req.body.date,
    openingtype: req.body.openingType,
    description: req.body.description,
    formdata: req.body.formdata,
    status: "open"
  }

  const dataObj = new JobSchema(data);
  await dataObj.save();
  req.flash('success', { msg: 'Job Successfully posted' });
  res.redirect('/admin');

};

exports.getJobForm = (req, res) => {
  if(req.user.usertype=="admin"){
      res.render('admin/jobForm',{
        name: req.user.name,
        usertype: req.user.usertype });
    };
  };

exports.showChart = (req, res) => {
    res.render('admin/showChart');
   
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/admin/');
  }
  res.render('admin/signup', {
    title: 'Create Account'
  });
};

exports.postSignup = (req, res, next) => {
  console.log("Admin post signup");
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  // var name = req.body.name[0].toUpperCase() +  
  //         req.body.name.slice(1);

  var name=req.body.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  const user = new Admin({
    email: req.body.email,
    password: req.body.password,
    name: name,
    usertype: req.body.usertype
  }); 

  Admin.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/admin/register');
    }
    user.save((err) => {
      if (err) { return next(err); }
      console.log("redirect to login");
      res.redirect('/admin/login');
      /*req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });*/
    });
  });
  
};


exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    title: 'Login'
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/admin/login');
  }
  req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

  passport.authenticate('admin', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/admin/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      /*res.redirect(req.session.returnTo || '/');*/
      res.redirect('/admin');
      

    });
  })(req, res, next);
};


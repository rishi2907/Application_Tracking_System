const validator = require('validator');
const passport = require('passport');
const User = require('../models/User');
var {getJobCard}= require('../routes/JobCard');
const JobSchema = require('../models/JobSchema');
const JobData = require('../models/JobData');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { ReplSet } = require('mongodb');



exports.appliedApplications = async (req, res) => {
  if(req.user){
    var statusData = await JobData.find({emailID: req.user.email});
    var result = [];
    for(var i=0; i<statusData.length; i++){
      var temp = await JobSchema.findOne({_id: statusData[i].jobID});
      result.push({
        jobtitle: temp.jobtitle,
        salary: temp.salary,
        experience: temp.experience,
        eligibility: temp.eligibility,
        status:statusData[i].status});
    }

    console.log(result);
    
   res.render('applicationSection', {
     name: req.user.name,
     applicationData: result 
   });
 
  }else{
   res.redirect('/');
 
 }
 
};

exports.clickButton1 = (req, res) => {
  res.redirect('/');
};


exports.clickButton2 = async (req, res) => {
  var tempData = await JobSchema.find({openingtype:"nontechnical", status:"open"});
  var data = [];

  var today = new Date();
  var todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  
  

  for(i=0; i<tempData.length; i++ ){
    if(new Date(tempData[i].lastdate) < new Date(todayDate) ){
      tempData[i].status = "closed";
      tempData[i].save();

    }
    else{
      data.push(tempData[i]);
    }

  }
  if(req.user){
   res.render('index', {
     name: req.user.name,
     Jobdata: data,
   });
 
  }else{
   res.render('index', { 
     name:"login_req",
     Jobdata: data,
  });
 
 }
 
};



exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/login', {
      title: 'Login'
    });
  };

  exports.applyNow = (req, res) => {
    if (req.user) {
      return res.render('stepper');
    }
    return res.redirect('/login');
    
  };

  // exports.logDone = (req, res) => {
  //   console.log("logging int");
  //   console.log(req.user);
  //   res.render('index', {
  //     name: req.user.name,
  //     JobCard : getJobCard,
  //     tag: 1
  //   });
  // };

  exports.logoutDone = (req, res) => {
     req.logout();
     res.redirect("/");
  };


  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/');
    }
    res.render('account/signup', {
      title: 'Create Account'
    });
  };

  exports.postLogin = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' });
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors);
      return res.redirect('login');
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', info);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You are logged in.' });
        /*res.redirect(req.session.returnTo || '/');*/
        res.redirect('/');
        

      });
    })(req, res, next);
  };


  // exports.postSignup = (req, res, next) => {
  //   console.log("signup route visited");
  //   const validationErrors = [];
  //   if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
  //   if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  //   if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });
  
  //   if (validationErrors.length) {
  //     req.flash('errors', validationErrors);
  //     return res.redirect('/signup');
  //   }
  //   req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });
  //   // var name = req.body.name[0].toUpperCase() +  
  //   //         req.body.name.slice(1);

  //   var name=req.body.name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  
  //   const user = new User({
  //     email: req.body.email,
  //     password: req.body.password,
  //     name: name
  //   }); 
  
    // User.findOne({ email: req.body.email }, (err, existingUser) => {
    //   if (err) { return next(err); }
    //   if (existingUser) {
    //     req.flash('errors', { msg: 'Account with that email address already exists.' });
    //     return res.redirect('/signup');
    //   }
    //   user.save((err) => {
    //     if (err) { return next(err); }
    //     res.redirect('/login');
    //     /*req.logIn(user, (err) => {
    //       if (err) {
    //         return next(err);
    //       }
    //       res.redirect('/');
    //     });*/
    //   });
    // });
    
  // };


  exports.postSignup = (req, res, next) => {
    console.log("signup route visited");
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
  
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: name
    }); 
  
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/signup');
      }

      const name = user.name;
      const email = user.email;
      const password = user.password;

      const token = jwt.sign({name,email,password}, "tokenGenerator", {expiresIn: '10m'});
    
      // console.log(user.email + " " + user.password + "---------------------------");
      // console.log(token);   


      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'codenikhil123@gmail.com',
          pass: 'qwerty@123'
          
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'codenikhil123@gmail.com',
        subject: 'IIITDMJ JobPortal Account Verification',
        text: 'You are receiving this because you (or someone else) have requested to create a new account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/verifyToken/' + token + '\n\n'
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        if(err){
          req.flash('errors', { msg: err});
          return res.send(err);
        }
        else
        req.flash('success', { msg: 'Verification token is sent on your email-id click on the token to verify and activate your account' });
        
        res.redirect("/login");
      });
      
    });
    
  };


  exports.verifyToken = (req, res, next) => {

    const token = req.params.token;

    if(token){
      jwt.verify(token,"tokenGenerator",function(err, decodedToken){
        if(err){
          req.flash('errors', { msg: 'Token is either invalid or it has expired' });
          res.redirect('/login');
        }
        const {name, email, password} = decodedToken;
        
        const user = new User({
          email: email,
          password: password,
          name: name
        }); 
        User.findOne({ email: email }, (err, existingUser) => {
          if (err) { return next(err); }
          if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address already exists.' });
            return res.redirect('/signup');
          }
          user.save((err) => {
            if (err) { return next(err); }
            res.redirect('/login');
          });
        });

      });
    }
    else{
      res.redirect('/');
    }
    
    
  };
  

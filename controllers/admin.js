const validator = require('validator');
const passport = require('passport');
const Admin = require('../models/Admin');
const JobSchema = require('../models/JobSchema');
const JobData = require('../models/JobData');
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


exports.download = async (req, res) => {
  console.log("Hello");
  var jobID = req.params.jobID;
  var fields = [];
  var data = {};
  var result = [];
  const opts = { fields };

  var jobData = await JobData.find({ jobID: jobID });

  //getting headers
  var parsedData = JSON.parse(jobData[0].formData);
  for (const prop in parsedData) {
    fields.push(prop);
  }

  //getting data
  for (i = 0; i < jobData.length; i++) {
    data = {};
    var parsedData = JSON.parse(jobData[i].formData);
    for (const prop in parsedData) {
      var temp = parsedData[prop]['value'];
      data[prop] = temp;
    }
    result.push(data);
  }
  var filename = '' + jobID + '.csv';
  const downloadFile = (res, fileName, fields, jobData) => {
    const json2csv = new Parser(opts);
    const csv = json2csv.parse(jobData);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  }
  return downloadFile(res, filename, opts, result);
};

exports.selectedDownload = async (req, res) => {
  var jobID = req.params.jobID;
  var fields = [];
  var data = {};
  var result = [];
  const opts = { fields };

  var jobData = await JobData.find({ jobID: jobID, adminStatus: "Accepted" });
  console.log(jobData);
  if (jobData.length == 0) {
    res.send('No candidate selected yet');
  }
  else {
    //getting headers
    var parsedData = JSON.parse(jobData[0].formData);
    for (const prop in parsedData) {
      fields.push(prop);
    }

    //getting data
    for (i = 0; i < jobData.length; i++) {
      data = {};
      var parsedData = JSON.parse(jobData[i].formData);
      for (const prop in parsedData) {
        var temp = parsedData[prop]['value'];
        data[prop] = temp;
      }
      result.push(data);
    }
    var filename = '' + jobID + '.csv';
    const downloadFile = (res, fileName, fields, jobData) => {
      const json2csv = new Parser(opts);
      const csv = json2csv.parse(jobData);
      res.header('Content-Type', 'text/csv');
      res.attachment(fileName);
      return res.send(csv);
    }
    return downloadFile(res, filename, opts, result);
  }
};

exports.selectedApplication = async (req, res) => {
  if (req.user) {
    var jobID = req.params.jobID;
    var jobData = await JobData.find({ jobID: jobID, adminStatus: "Accepted" });
    var result = [];
    console.log(jobData);

    for (var i = 0; i < jobData.length; i++) {
      var parsedData = JSON.parse(jobData[i].formData);

      var objData = {
        _id: jobData[i]._id,
        jobID: jobData[i].jobID,
        emailID: jobData[i].emailID,
        formData: parsedData
      }

      result.push(objData);

    }

    res.render('admin/selectedApplication',
      {
        name: req.user.name,
        usertype: req.user.usertype,
        jobID: jobID,
        applicationData: result
        // totalApplications: totalApplications,
        // pendingApplications: totalApplications-acceptedApplications-rejectedApplications,
        // acceptedApplications: acceptedApplications,
        // rejectedApplications: rejectedApplications
      });

  }
  else {
    res.redirect('/admin/login');
  }

};


exports.declareResult = async (req, res) => {
  if (req.user) {
    var jobID = req.params.jobID;
    var jobData = await JobData.find({ jobID: jobID });

    for (var i = 0; i < jobData.length; i++) {
      jobData[i].status = jobData[i].adminStatus;
      jobData[i].save();
    }

    var jobSchema = await JobSchema.findOne({ _id: jobID });
    jobSchema.status = "resultOut";
    jobSchema.save();

    req.flash('success', { msg: 'Result Declared' });

    res.redirect('/admin');

  }
  else {
    res.redirect('/admin/login');
  }

};


exports.acceptApplication = async (req, res) => {
  if (req.user) {
    var appID = req.params.appID;
    var userData = await JobData.findOne({ _id: appID });
    userData.adminStatus = "Accepted";
    userData.save();
    res.redirect('/admin/pending/' + userData.jobID);

  }
  else {
    res.redirect('/admin/login');
  }

};


exports.rejectApplication = async (req, res) => {
  if (req.user) {
    var appID = req.params.appID;
    var userData = await JobData.findOne({ _id: appID });
    userData.adminStatus = "Rejected";
    userData.save();
    res.redirect('/admin/pending/' + userData.jobID);

  }
  else {
    res.redirect('/admin/login');
  }

};

exports.showApplication = async (req, res) => {
  if (req.user) {
    var jobID = req.params.jobID;
    var jobData = await JobData.find({ jobID: jobID, adminStatus: "Applied" });

    var result = [];
    var totalApplications = await JobData.count({ jobID: jobID });
    var acceptedApplications = await JobData.count({ jobID: jobID, adminStatus: "Accepted" });
    var rejectedApplications = await JobData.count({ jobID: jobID, adminStatus: "Rejected" });
    console.log(totalApplications);



    for (var i = 0; i < jobData.length; i++) {
      var parsedData = JSON.parse(jobData[i].formData);

      var objData = {
        _id: jobData[i]._id,
        jobID: jobData[i].jobID,
        emailID: jobData[i].emailID,
        formData: parsedData
      }

      result.push(objData);

    }

    res.render('admin/showApplication',
      {
        name: req.user.name,
        usertype: req.user.usertype,
        jobID: jobID,
        applicationData: result,
        totalApplications: totalApplications,
        pendingApplications: totalApplications - acceptedApplications - rejectedApplications,
        acceptedApplications: acceptedApplications,
        rejectedApplications: rejectedApplications
      });

  }
  else {
    res.redirect('/admin/login');
  }

};



exports.showJob = async (req, res) => {
  if (req.user) {
    // var data = await JobSchema.find({
    //   $or: [
    //     { status: { $eq: 'open' } },
    //     { status: { $eq: 'closed' } }
    //   ]
    // });
    var data = await JobSchema.find();
    res.render('admin/showJob',
      {
        name: req.user.name,
        usertype: req.user.usertype,
        Jobdata: data
      });
  }
  else {
    res.redirect('/admin/login');
  }

};
exports.getsuccessjob = (req, res) => {
  if (req.user.usertype == "admin") {
    req.flash('success', { msg: 'Job Successfully posted' });
    res.redirect('/admin');
  };
};

exports.postJobForm = async (req, res) => {

  // console.log(req)
  // console.log(req.body.formdata["personalInformation#Name"])
  let jobform = {};
  jobform["personalInformation"] = {};
  jobform["educationInformation"] = {};
  jobform["experienceInformation"] = {};
  jobform["additionalInformation"] = {};

  for (let property in req.body.formdata) {
    outer0 = property.split("#");
    // console.log(outer0)
    if (req.body.formdata[property]["field_type"] == "radio") {
      jobform[outer0[0]][outer0[1]] = { "type": req.body.formdata[property]["field_type"], "value": req.body.formdata[property]["field_value"] }

    }
    else {
      jobform[outer0[0]][outer0[1]] = { "type": req.body.formdata[property]["field_type"] }

    }
    // console.log("Key: " + property);
    // console.log("Value: " + req.body.formdata[property]);
    // formdata[k] = v;
  }
  console.log(jobform);

  var data = {
    jobtitle: req.body.jobtitle,
    salary: req.body.salary,
    experience: req.body.experience,
    eligibility: req.body.elegibility,
    lastdate: req.body.date,
    openingtype: req.body.openingType,
    description: req.body.description,
    formdata: JSON.stringify(jobform),
    status: "open"
  }

  const dataObj = new JobSchema(data);
  await dataObj.save();
  // req.flash('success', { msg: 'Job Successfully posted' });
  res.redirect('/admin');


};

exports.getJobForm = (req, res) => {
  if (req.user.usertype == "admin") {
    res.render('admin/jobForm', {
      name: req.user.name,
      usertype: req.user.usertype
    });
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

// exports.postSignup = (req, res, next) => {
//   console.log("Admin post signup");
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

//   const user = new Admin({
//     email: req.body.email,
//     password: req.body.password,
//     name: name,
//     usertype: req.body.usertype
//   }); 

//   Admin.findOne({ email: req.body.email }, (err, existingUser) => {
//     if (err) { return next(err); }
//     if (existingUser) {
//       req.flash('errors', { msg: 'Account with that email address already exists.' });
//       return res.redirect('/admin/register');
//     }
//     user.save((err) => {
//       if (err) { return next(err); }
//       console.log("redirect to login");
//       res.redirect('/admin/login');
//       /*req.logIn(user, (err) => {
//         if (err) {
//           return next(err);
//         }
//         res.redirect('/');
//       });*/
//     });
//   });

// };


exports.verifyAdminToken = (req, res, next) => {
  const token = req.params.token;

  if (token) {
    jwt.verify(token, "tokenGenerator", function (err, decodedToken) {
      if (err) {
        req.flash('errors', { msg: 'Token is either invalid or it has expired' });
        return res.redirect('/login');
      }
      const { name, email, password, usertype } = decodedToken;

      const user = new Admin({
        email: email,
        password: password,
        name: name,
        usertype: usertype
      });


      Admin.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
          req.flash('errors', { msg: 'Account with that email address already exists.' });
          return res.redirect('/admin/register');
        }
        user.save((err) => {
          if (err) { return next(err); }
          return res.redirect('/admin');
        });
      });

    });
  }
  else {
    res.redirect('/');
  }

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

  var name = req.body.name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

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

    const name = user.name;
    const email = user.email;
    const password = user.password;
    const usertype = user.usertype;

    const token = jwt.sign({ name, email, password, usertype }, "tokenGenerator", { expiresIn: '10m' });

    var smtpTransport = nodemailer.createTransport({
      service: 'Yahoo', 
        auth: {
          user: 'innovaccer@yahoo.com',
          pass: 'lkpmgahdxpmkvuyt'
          
        }
    });

    var mailOptions = {
      to: user.email,
      from: 'innovaccer@yahoo.com',
      subject: 'IIITDMJ JobPortal Account Verification',
      text: 'You are receiving this because you (or someone else) have requested to create a new account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/admin/verifyAdminToken/' + token + '\n\n'
    };

    smtpTransport.sendMail(mailOptions, function (err) {
      console.log(err);
      console.log('mail sent---------------------');
      req.flash('success', { msg: 'Verification token is sent on your email-id click on the token to verify and activate your account' });
      res.redirect("/login");
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

exports.getForgot = async (req, res) => {
  if (req.user) {
    return res.redirect('/admin');

  } else {

    return res.render('admin/forgot', {});
  }

};

exports.postForgot = async (req, res) => {
  if (req.user) {
    res.redirect('/admin');

  } else {
    const email = req.body.email;
    console.log(email + "------------------------------");

    const token = jwt.sign({ email }, "tokenGenerator", { expiresIn: '10m' });


    var smtpTransport = nodemailer.createTransport({
      service: 'Yahoo', 
        auth: {
          user: 'innovaccer@yahoo.com',
          pass: 'lkpmgahdxpmkvuyt'
          
        }
    });

    var mailOptions = {
      to: email,
      from: 'innovaccer@yahoo.com',
      subject: 'IIITDMJ JobPortal Password Reset',
      text: 'You are receiving this because you (or someone else) have requested to change your password.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/admin/changePassword/' + token + '\n\n'
    };

    smtpTransport.sendMail(mailOptions, function (err) {
      if (err) {
        req.flash('errors', { msg: err });
        return res.send(err);
      }
      else
        req.flash('success', { msg: 'link to reset your password has been sent on youe email' });

      res.redirect("/admin/login");
    });

  }

};


exports.changePassword = (req, res, next) => {

  const token = req.params.token;

  if (token) {
    jwt.verify(token, "tokenGenerator", function (err, decodedToken) {
      if (err) {
        req.flash('errors', { msg: 'Token is either invalid or it has expired' });
        return res.redirect('/admin/login');
      }
      const { email } = decodedToken;

      Admin.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        if (existingUser) {
          return res.render('admin/reset', { email: email });
        }
        req.flash('errors', { msg: 'invalid Email-id or Token' });
        return res.redirect('/admin');

      });

    });
  }
  else {
    res.redirect('/admin');
  }


};


exports.updatePassword = (req, res, next) => {

  validationErrors = [];


  // console.log("--------------------------");
  // console.log(req.body.email + req.body.password1 + " " + req.body.password2  );

  if (!validator.isLength(req.body.password1, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
  if (req.body.password1 !== req.body.password2) validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('back');
  }

  Admin.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }

    existingUser.password = req.body.password1;
    existingUser.save();

    req.flash('success', { msg: 'Your Password has been changed' });
    return res.redirect('/admin/login');

  });

};


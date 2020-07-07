const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    jobtitle: String,
    salary: String,
    experience: String,
    eligibility: String,
    lastdate: String,
    openingtype: String,
    description: String,
    amount: String,
    formdata: String,
    status: String
});

module.exports = mongoose.model('JobSchema', JobSchema);

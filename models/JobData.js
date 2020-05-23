const mongoose = require('mongoose');

const JobDataSchema = new mongoose.Schema({
    jobID: String,
    emailID: String,
    formData: String,
    status: String,
    adminStatus: String
});

module.exports = mongoose.model('JobData', JobDataSchema);
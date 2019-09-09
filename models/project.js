const mongoose = require('mongoose');
const moment = require('moment')
const Schema = mongoose.Schema;

// Define Schema
const projectSchema = new Schema({
    name: { type: String, required: true, lowercase: true },
    createdOn: { type: String, default: moment().format('MM/DD/YYYY HH:mm:ss'), required: true},
    startedOn: String,
    endedOn: String,
    totalTimeDuration: String,
    totalTimeOnProject: String,
    currentSessionTime: String,
    isActive: Boolean
});

// Model schema into a class
const Project = mongoose.model('project', projectSchema);

// Export Schema
module.exports.Project = Project;
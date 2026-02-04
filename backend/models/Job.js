const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: {
        type: [String],
        default: []
    },
    minExperience: {
        type: Number,
        default: 0
    },
    maxExperience: {
        type: Number
    },
    education: {
        type: String,
        default: 'Any Degree'
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Internship', 'Contract'],
        default: 'Full-time'
    },
    location: {
        type: String,
        default: 'Remote'
    },
    companyName: {
        type: String,
        default: 'Company Not Specified'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);

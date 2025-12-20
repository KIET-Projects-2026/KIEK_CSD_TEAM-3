const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number
    },
    matchingSkills: {
        type: [String]
    },
    missingSkills: {
        type: [String]
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    source: {
        type: String,
        enum: ['global_match', 'specific_match'],
        default: 'global_match'
    }
});

module.exports = mongoose.model('Application', applicationSchema);

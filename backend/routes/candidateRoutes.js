const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { getJobMatches } = require('../services/mlService');
const fs = require('fs');

// @route   POST /api/candidate/match
// @desc    Upload resume and get matches (No DB save)
// @access  Protected
router.post('/match', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        // 1. Fetch jobs
        const jobs = await Job.find({});
        if (jobs.length === 0) {
             if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(404).json({ message: 'No jobs available' });
        }

        // 2. Prepare jobs for ML
        const jobsForML = jobs.map(job => ({
            id: job._id.toString(),
            title: job.title,
            description: job.description
        }));

        // 3. Call ML service
        const mlResponse = await getJobMatches(req.file.path, jobsForML);

        if (!mlResponse || mlResponse.status !== 'success' || !Array.isArray(mlResponse.matches)) {
            throw new Error('Invalid response from ML service');
        }

        // 4. Normalize ML output and merge with job details
        const matches = mlResponse.matches.map(match => {
            const jobDetails = jobs.find(j => j._id.toString() === match.job_id);
            return {
                jobId: match.job_id,
                title: jobDetails ? jobDetails.title : 'Unknown Job',
                description: jobDetails ? jobDetails.description : '',
                score: match.score,
                matchingSkills: match.matching_skills || [],
                missingSkills: match.missing_skills || []
            };
        });

        // 5. Cleanup uploaded file
        fs.unlink(req.file.path, () => {});

        // Return matches ONLY (Do not save to DB)
        return res.json({
            success: true,
            results: matches
        });

    } catch (error) {
        console.error(error);
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// @route   POST /api/candidate/apply/:jobId
// @desc    Apply to a specific job (Save to DB)
// @access  Protected
router.post('/apply/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { score, matchingSkills, missingSkills } = req.body;
        
        const candidateId = req.user.id;

        // Check availability
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApp = await Application.findOne({ jobId, candidateId });
        if (existingApp) {
             return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Create Application
        const application = new Application({
            jobId,
            candidateId,
            score: score || 0,
            matchingSkills: matchingSkills || [],
            missingSkills: missingSkills || []
        });

        await application.save();

        res.json({ success: true, message: 'Application submitted' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/candidate/applications
// @desc    Get application history
// @access  Protected
router.get('/applications', async (req, res) => {
    try {
        const candidateId = req.user.id;

        const applications = await Application.find({ candidateId })
            .populate('jobId', 'title description')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

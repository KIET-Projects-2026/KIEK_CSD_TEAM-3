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
        const jobs = await Job.find({}).populate('recruiterId', 'companyName');
        if (jobs.length === 0) {
             if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(404).json({ message: 'No jobs available' });
        }

        // 2. Prepare jobs for ML
        // 2. Prepare jobs for ML - COMPOSITE TEXT GENERATION
        const jobsForML = jobs.map(job => {
            const compositeText = `
                Job Title: ${job.title}
                Description: ${job.description}
                Required Skills: ${job.requiredSkills ? job.requiredSkills.join(', ') : ''}
                Experience: ${job.minExperience || 0} - ${job.maxExperience || 'Any'} years
                Education: ${job.education || 'Any'}
                Job Type: ${job.jobType || 'Full-time'}
                Location: ${job.location || 'Remote'}
            `.trim();

            return {
                id: job._id.toString(),
                title: job.title, // Keep title for result display
                description: compositeText // Send composite text as 'description' for ML
            };
        });

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
                requiredSkills: jobDetails ? jobDetails.requiredSkills : [],
                minExperience: jobDetails ? jobDetails.minExperience : 0,
                maxExperience: jobDetails ? jobDetails.maxExperience : 0,
                education: jobDetails ? jobDetails.education : '',
                jobType: jobDetails ? jobDetails.jobType : '',
                location: jobDetails ? jobDetails.location : '',
                companyName: (!jobDetails.companyName || jobDetails.companyName === 'Company Not Specified') 
                    ? ((jobDetails.recruiterId && jobDetails.recruiterId.companyName) ? jobDetails.recruiterId.companyName : 'Company Not Specified')
                    : jobDetails.companyName,
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

// @route   GET /api/candidate/jobs
// @desc    Get all jobs for specific matching
// @access  Protected
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('recruiterId', 'companyName').sort({ createdAt: -1 });
        
        const jobsWithResolvedCompany = jobs.map(job => {
            const jobObj = job.toObject();
            if ((!jobObj.companyName || jobObj.companyName === 'Company Not Specified') && job.recruiterId && job.recruiterId.companyName) {
                jobObj.companyName = job.recruiterId.companyName;
            }
            return jobObj;
        });

        res.json(jobsWithResolvedCompany);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/candidate/check-score/:jobId
// @desc    Check score for a specific job (No DB save)
// @access  Protected
router.post('/check-score/:jobId', upload.single('resume'), async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: 'Resume file is required' });
        }

        const job = await Job.findById(jobId).populate('recruiterId', 'companyName');
        if (!job) {
             if (req.file) fs.unlink(req.file.path, () => {});
            return res.status(404).json({ message: 'Job not found' });
        }

        // Prepare single job for ML
        // Prepare single job for ML - COMPOSITE TEXT GENERATION
        const compositeText = `
            Job Title: ${job.title}
            Description: ${job.description}
            Required Skills: ${job.requiredSkills ? job.requiredSkills.join(', ') : ''}
            Experience: ${job.minExperience || 0} - ${job.maxExperience || 'Any'} years
            Education: ${job.education || 'Any'}
            Job Type: ${job.jobType || 'Full-time'}
            Location: ${job.location || 'Remote'}
        `.trim();

        const jobsForML = [{
            id: job._id.toString(),
            title: job.title,
            description: compositeText
        }];

        // Call ML service
        const mlResponse = await getJobMatches(req.file.path, jobsForML);

        // Cleanup
        fs.unlink(req.file.path, () => {});

        if (!mlResponse || mlResponse.status !== 'success' || !Array.isArray(mlResponse.matches) || mlResponse.matches.length === 0) {
            return res.status(500).json({ message: 'Error calculating score' });
        }

        const result = mlResponse.matches[0];
        
        return res.json({
            success: true,
            score: result.score,
            matchingSkills: result.matching_skills || [],
            missingSkills: result.missing_skills || [],
            requiredSkills: job.requiredSkills || [],
            minExperience: job.minExperience || 0,
            maxExperience: job.maxExperience || 0,
            education: job.education || '',
            jobType: job.jobType || '',
            location: job.location || '',
            companyName: (!job.companyName || job.companyName === 'Company Not Specified') 
                ? ((job.recruiterId && job.recruiterId.companyName) ? job.recruiterId.companyName : 'Company Not Specified')
                : job.companyName
        });

    } catch (error) {
        console.error(error);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/candidate/apply/:jobId
// @desc    Apply to a specific job (Save to DB)
// @access  Protected
router.post('/apply/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { score, matchingSkills, missingSkills, source } = req.body;
        
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
            missingSkills: missingSkills || [],
            source: source || 'global_match'
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
            .populate({
                path: 'jobId',
                select: 'title description requiredSkills minExperience maxExperience education jobType location companyName recruiterId',
                populate: { path: 'recruiterId', select: 'companyName' }
            })
            .sort({ appliedAt: -1 });

        const applicationsWithResolvedCompany = applications.map(app => {
            const appObj = app.toObject();
            if (appObj.jobId) {
                 const job = appObj.jobId;
                 if ((!job.companyName || job.companyName === 'Company Not Specified') && job.recruiterId && job.recruiterId.companyName) {
                     job.companyName = job.recruiterId.companyName;
                 }
            }
            return appObj;
        });

        res.json(applicationsWithResolvedCompany);
    } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

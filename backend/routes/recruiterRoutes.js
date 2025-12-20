const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route   GET /api/recruiter/applications/:jobId
// @desc    Get all applications for a specific job (Owned by recruiter)
// @access  Protected
router.get('/applications/:jobId', async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const recruiterId = req.user.id; // Assume existing

        // Check if job belongs to recruiter
        const job = await Job.findOne({ _id: jobId, recruiterId });
        if (!job) {
             return res.status(403).json({ message: 'Not authorized to view this job applications' });
        }

        const applications = await Application.find({ jobId })
            .populate('candidateId', 'name email skills')
            .sort({ score: -1 });

        res.json(applications);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/recruiter/jobs
// @desc    Get all jobs posted by the recruiter
// @access  Protected
router.get('/jobs', async (req, res) => {
    try {
        const recruiterId = req.user.id;
        
        // Fetch jobs for this recruiter only
        const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });

        // Get application counts for each job
        const jobWithCounts = await Promise.all(jobs.map(async (job) => {
            const count = await Application.countDocuments({ jobId: job._id });
            return { ...job.toObject(), applicationCount: count };
        }));

        res.json(jobWithCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/recruiter/jobs
// @desc    Post a new job
// @access  Protected
router.post('/jobs', async (req, res) => {
    try {
        const { title, description } = req.body;
        const recruiterId = req.user.id;
        
        // Validation
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        const newJob = new Job({
            recruiterId,
            title,
            description
        });

        const job = await newJob.save();
        
        // Return job with 0 count
        res.json({ ...job.toObject(), applicationCount: 0 });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/recruiter/applications/:applicationId/accept
// @desc    Accept an application
// @access  Protected
router.patch('/applications/:applicationId/accept', async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const recruiterId = req.user.id;

        const application = await Application.findById(applicationId).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership
        const job = await Job.findOne({ _id: application.jobId._id, recruiterId });
        if (!job) {
             return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = 'accepted';
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/recruiter/applications/:applicationId/reject
// @desc    Reject an application
// @access  Protected
router.patch('/applications/:applicationId/reject', async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const recruiterId = req.user.id;

        const application = await Application.findById(applicationId).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership
        const job = await Job.findOne({ _id: application.jobId._id, recruiterId });
        if (!job) {
             return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = 'rejected';
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/recruiter/jobs/:jobId
// @desc    Delete a job
// @access  Protected
router.delete('/jobs/:jobId', async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const recruiterId = req.user.id;

        const job = await Job.findOne({ _id: jobId, recruiterId });
        if (!job) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await Job.deleteOne({ _id: jobId });
        await Application.deleteMany({ jobId: jobId });

        res.json({ message: 'Job removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

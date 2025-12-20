import axios from 'axios';

// Backend URL
const API_BASE = 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach token if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Although backend routes are public for now, good practice
  }
  return config;
});

// API Methods
export const registerUser = (data) => apiClient.post('/auth/register', data);
export const loginUser = (data) => apiClient.post('/auth/login', data);
export const getRecruiterProfile = (id) => apiClient.get(`/profile/recruiter/${id}`);
export const getCandidateProfile = (id) => apiClient.get(`/profile/candidate/${id}`);

// Candidate
export const matchResume = (formData) => apiClient.post('/candidate/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const applyToJob = (jobId, applicationData) => apiClient.post(`/candidate/apply/${jobId}`, applicationData);
export const getCandidateApplications = () => apiClient.get('/candidate/applications');

// Recruiter
export const getRecruiterJobs = () => apiClient.get('/recruiter/jobs');
export const postJob = (jobData) => apiClient.post('/recruiter/jobs', jobData);
export const getJobApplications = (jobId) => apiClient.get(`/recruiter/applications/${jobId}`);
export const updateApplicationStatus = (appId, status) => apiClient.patch(`/recruiter/applications/${appId}/${status}`);
export const deleteRecruiterJob = (jobId) => apiClient.delete(`/recruiter/jobs/${jobId}`);

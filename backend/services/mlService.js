const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const getJobMatches = async (resumePath, jobs) => {
    try {
        const formData = new FormData();
        formData.append('resume', fs.createReadStream(resumePath));
        formData.append('jobs', JSON.stringify(jobs));

        const response = await axios.post('http://127.0.0.1:8000/match', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        return response.data;
    } catch (error) {
        console.error('ML Service Error:', error.message);
        throw error;
    }
};

module.exports = { getJobMatches };

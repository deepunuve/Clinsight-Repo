import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const fetchStudyTypes = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/temp/studytype.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchStudies = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('https://your-api-endpoint.com/studies'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchStudyDetails = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('https://your-api-endpoint.com/studies'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

// Alternatively, you can use a mock response for testing purposes.
export const getMockStudies = async () => {
  try {
    // Make an actual API call to a mock file
    const response = await axios.get('/temp/study.json'); // Replace with your actual mock file location or endpoint.    
    return response.data; // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching mock studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const getMockStudyDetails = async (studyId) => {
  try {
    // Make an actual API call to a mock file
    const response = await axios.get('/temp/studyDetails.json'); // Replace with your actual mock file location or endpoint.
    console.log(response)
    return response.data; // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching mock studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const getMockDashboard = async (studyId) => {
  try {
    // Make an actual API call to a mock file
    const response = await axios.get('/temp/dashCount.json'); // Replace with your actual mock file location or endpoint.
    console.log(response)
    return response.data; // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching mock studies:', error);
    return []; // Return an empty array in case of an error
  }
};

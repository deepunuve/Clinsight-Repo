import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const fetchStudyTypes = async () => {
  try {
    // Make an actual API call using Axios
    //const response = await axios.get('/temp/studytype.json'); // Replace with your actual API endpoint.
    const response = await axios.get('http://184.105.215.253:9003/return_study_type/'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchStudies = async () => {
  try {
    // Make an actual API call using Axios
    //const response = await axios.get('http://184.105.215.253:9003/return_studylist'); // Replace with your actual API endpoint.
    const response = await axios.get('/temp/study.json'); // Replace with your actual mock file location or endpoint.  
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchStudyDetails = async (studyId) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('http://184.105.215.253:9003/return_study_details?id=' + studyId); // Replace with your actual API endpoint.
    //const response = await axios.get('/temp/studyDetails.json');
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};


export const getDashboardData = async (studyId) => {
  try {
    // Make an actual API call to a mock file
    const response = await axios.get('http://184.105.215.253:9004/dash_board_data?study_id=' + studyId);
    //const response = await axios.get('/temp/dashCount.json'); // Replace with your actual mock file location or endpoint.
    console.log(response)
    return response.data; // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching mock studies:', error);
    return []; // Return an empty array in case of an error
  }
};

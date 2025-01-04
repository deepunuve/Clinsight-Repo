import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const fetchStudyTypes = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/api1/return_study_type/'); // Replace with your actual API endpoint.
    //const response = await axios.get('http://184.105.215.253:9003/return_study_type/'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchStudies = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/api1/studylist_nl'); // Replace with your actual API endpoint.
    console.log(response);
    //const response = await axios.get('/temp/study.json'); // Replace with your actual mock file location or endpoint.  
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};
export const fetchStudyDetails = async (payload) => {
  try {
    console.log(payload);
    // Make an actual API call using Axios
    const response = await axios.post('/api1/study_details_nl', payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });// Replace with your actual API endpoint.
    return response.data;
    // if (payload.doc_type.length === 0) {
    //   const response = await axios.get('/temp/studyDetails.json');
    //   return response.data;
    // } else {
    //   const response = await axios.get('/temp/studyDetails1.json');
    //   return response.data;
    // }
    // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};


export const getDashboardData = async (payload) => {
  try {
    console.log(payload);
    const response = await axios.post('/api2/dash_board_data_nl/', payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });// Replace with your actual API endpoint.
    return response.data;
    // if (payload.doc_type.length === 0) {
    //   const response = await axios.get('/temp/dashCount.json');
    //   return response.data;
    // } else {
    //   const response = await axios.get('/temp/dashCount1.json');
    //   return response.data;
    // }
    // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching mock studies:', error);
    return []; // Return an empty array in case of an error
  }
};

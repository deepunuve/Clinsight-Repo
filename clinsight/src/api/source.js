import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const fetchNIHResult = async (payload) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.post('http://184.105.215.253:9003/clinical_trials_filter/', payload);
    //const response = await axios.post('/api1/clinical_trials_filter/', payload); // Replace with your actual API endpoint.
    //const response = await axios.post('/temp/nih.json', { condition }); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchPubmedResult = async (payload) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.post('http://184.105.215.253:9003/Pubmed_filter/', payload);
    //const response = await axios.post('/api1/Pubmed_filter/', payload); // Replace with your actual API endpoint.
    //const response = await axios.post('/temp/nih.json', { condition }); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchChempResult = async (payload) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.post('http://184.105.215.253:9004/chembl_filter?input_chemical=' + payload); // Replace with your actual API endpoint.
    //const response = await axios.post('/api2/chembl_filter?input_chemical=' + payload); // Replace with your actual API endpoint.
    //const response = await axios.post('/temp/nih.json', { condition }); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};


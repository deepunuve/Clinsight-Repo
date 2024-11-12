import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const fetchNIHResult = async (condition) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/temp/nih.json'); // Replace with your actual API endpoint.
    //const response = await axios.post('/temp/nih.json', { condition }); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const fetchPubmedResult = async (condition) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/temp/pubmed.json'); // Replace with your actual API endpoint.
    //const response = await axios.post('/temp/nih.json', { condition }); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};


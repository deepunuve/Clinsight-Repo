import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const getChatHistory = async (id) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/api2/read_chat_history_es/?user_id=123&study_id=' + id);
    //const response = await axios.get('http://184.105.215.253:9004/read_chat_history_es/?user_id=123&study_id=' + id);

    //const response = await axios.get('/temp/chat.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const getSummary = async (id) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.post('http://184.105.215.253:9003/summarize_nl/?study_id=' + id);
    //const response = await axios.post('/api1/summarize_nl/?study_id=' + id);

    // const response = await axios.get('/temp/chat.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};
export const getChatResponse = async (payload) => {
  try {
    // Make an actual API call using Axios
    // const response = await axios.post('/api1/question-answering/', payload, {
    const response = await axios.post('http://184.105.215.253:9003/question-answering/', payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });// Replace with your actual API endpoint.
    //const response = await axios.get('/temp/resultData.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};



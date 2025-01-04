import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const getChatHistory = async (id) => {
  try {
    // Make an actual API call using Axios
    //const response = await axios.get('/api2/read_chat_history_es/?user_id=123&study_id=' + id);
    const response = await axios.get('http://184.105.215.253:9004/read_chat_history_es/?user_id=123&study_id=' + id);

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
    const response = await axios.post('http://184.105.215.253:9003/summarize/?study_id=' + id);
    //const response = await axios.post('/api1/summarize/?study_id=' + id);

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
    //const response = await axios.post('/api1/question-answering/', payload, {
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

// Function to save chat history (new question-answer)
export const saveChatHistory = async (question, answer) => {
  try {

    const response = await axios.post('/api/saveChat', {  // Replace with your API endpoint
      question: question,
      answer: answer,
      date: new Date().toLocaleString(),
    });

    // Check the response
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to save chat history');
    }
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};



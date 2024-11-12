import axios from 'axios';

// This is a mock API call. Replace it with your actual API endpoint.
export const getUsers = async () => {
  try {
    // Make an actual API call using Axios
    const response = await axios.get('/temp/user.json');
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};
// Function to save chat history (new question-answer)
export const validateUserSecret = async (username, password) => {
  try {

    // const response = await axios.post('/api/saveChat', {  // Replace with your API endpoint
    //   question: question,
    //   answer: answer,
    //   date: new Date().toLocaleString(),
    // });
    const response = await axios.get('/temp/user.json');
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



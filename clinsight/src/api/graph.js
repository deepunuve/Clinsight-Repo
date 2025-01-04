import axios from 'axios';
// This is a mock API call. Replace it with your actual API endpoint.
export const getGraphDocData = async (payload) => {
  try {
    // Make an actual API call using Axios
    console.log(payload);
    const response = await axios.post('/api2/document_graph_nl/', payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};

export const getGraphData = async (payload) => {
  try {
    // Make an actual API call using Axios
    const response = await axios.post('/api2/multiple_graph_nl/', payload, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    //const response = await axios.get('/temp/graph.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};


export const getPicoData = async (payload) => {
  try {
    // Make an actual API call using Axios
    // const response = await axios.post('http://184.105.215.253:9004/pico_nl/', payload, {
    //   headers: {
    //     'accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // });
    const response = await axios.get('/temp/pico.json'); // Replace with your actual API endpoint.
    return response.data;  // Axios automatically parses the JSON response, so we return the `data` property.
  } catch (error) {
    console.error('Error fetching studies:', error);
    return []; // Return an empty array in case of an error
  }
};



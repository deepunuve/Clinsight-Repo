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

export const transferFilesFromBox = async (boxApiToken, boxFolderId) => {
  try {
    const response = await axios.post('http://184.105.215.253:9003/transfer-files-from-box/', {
    //const response = await axios.post('/api1/transfer-files-from-box/', {
      box_api_token: boxApiToken,
      box_folder_id: boxFolderId
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;  // Return API response data
  } catch (error) {
    console.error('Error transferring files from Box:', error);
    return null; // Return null in case of an error
  }
};
export const transferFilesFromGDrive = async (google_drive_api_key, drive_link) => {
  try {
    const response = await axios.post('http://184.105.215.253:9003/transfer_google_drive_files/', {
      //const response = await axios.post('/api1/transfer_google_drive_files/', {
      google_drive_api_key: google_drive_api_key,
      drive_link: drive_link
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;  // Return API response data
  } catch (error) {
    console.error('Error transferring files from Box:', error);
    return null; // Return null in case of an error
  }
};

export const transferFilesFromDopBox = async (dropbox_token, dropbox_folder_path) => {
  try {
    const response = await axios.post('http://184.105.215.253:9003/transfer-dropbox-files/', {
      //const response = await axios.post('/api1/transfer-dropbox-files/', {
      dropbox_token: dropbox_token,
      dropbox_folder_path: dropbox_folder_path
    }, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    return response.data;  // Return API response data
  } catch (error) {
    console.error('Error transferring files from Box:', error);
    return error; // Return null in case of an error
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


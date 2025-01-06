
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Airflow = () => {
    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const username = 'admin';
            const password = 'test';
            const airflowDomain = 'http://184.105.215.253:8080'; // Change to HTTPS if possible

            const airflowUrl = `${airflowDomain}/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

            try {
                const response = await axios.get(airflowUrl);
                setIframeSrc(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <iframe title="Airflow Home Page" src={iframeSrc} width="100%" height="600" />
        </div>
    );
};

export default Airflow;
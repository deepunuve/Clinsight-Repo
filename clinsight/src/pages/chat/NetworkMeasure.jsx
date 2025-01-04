import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Table, Spinner, Card } from 'react-bootstrap';

// Function to calculate the color based on value
const interpolateColor = (startColor, endColor, factor) => {
    const result = startColor.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (endColor[i] - startColor[i]));
    }
    return `rgb(${result.join(",")})`;
};

// Convert hex color to RGB array
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [bigint >> 16, (bigint >> 8) & 255, bigint & 255];
};

// Color gradient configuration (dark red to dark green)
const startColor = hexToRgb("#fc0000");
const endColor = hexToRgb("#0c8823");

// Function to normalize the value and return a color
const getCellBackgroundColor = (value, min, max) => {
    const normalizedValue = (value - min) / (max - min);
    return interpolateColor(startColor, endColor, normalizedValue);
};

function NetworkMeasure(props) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minValue, setMinValue] = useState(Infinity);
    const [maxValue, setMaxValue] = useState(-Infinity);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api1/network-measures2/?study_id=' + props.studyId);
                setData(response.data);

                // Find the min and max values in the dataset
                const values = Object.values(response.data).flatMap(category =>
                    Object.values(category).map(Number)
                );
                setMinValue(Math.min(...values));
                setMaxValue(Math.max(...values));
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoize categories and metrics to avoid recalculating on each render
    const categories = useMemo(() => data ? Object.keys(data) : [], [data]);
    const metrics = useMemo(() => data && categories.length > 0 ? Object.keys(data[categories[0]]) : [], [data, categories]);

    // Function to format numbers to one decimal place
    const formatNumber = (num) => typeof num === 'number' ? num.toFixed(5) : num;

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" role="status" />
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return <div className="text-danger">Error: {error}</div>;
    }

    if (!data) {
        return null;
    }

    return (
        <div>
            <Card className="shadow-sm mt-4">
                <Card.Body>
                    <Table responsive bordered hover>
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Category</th>
                                {metrics.map((metric) => (
                                    <th key={metric} className="text-center">{metric}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category}>
                                    <td className="fw-bold">{category}</td>
                                    {metrics.map((metric) => {
                                        const value = data[category][metric];
                                        const bgColor = getCellBackgroundColor(value, minValue, maxValue);
                                        return (
                                            <td
                                                key={`${category}-${metric}`}
                                                style={{
                                                    backgroundColor: bgColor,
                                                    color: 'white',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {formatNumber(value)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default NetworkMeasure;

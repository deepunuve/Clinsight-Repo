import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

// Registering the chart elements
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const NightingaleChart = (props) => {
    // Access data from props
    const { labels, data } = props.dashData;

    const chartData = {
        labels: labels, // Access the labels from props
        datasets: [
            {
                label: 'Instance Count',
                data: data, // Access the data from the series
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderWidth: 2,
                borderColor: '#fff', // Remove the border color around each section
            },
        ],
    };

    const options = {
        scales: {
            r: {
                grid: {
                    display: false, // This hides the circular grid lines
                },
                angleLines: {
                    display: false, // Optionally hide the angle lines (spokes)
                },
                ticks: {
                    display: false, // Hides the scale values (ticks)
                },
                pointLabels: {
                    display: false, // Hides the labels at each data point
                },
            },
        },
        elements: {
            arc: {
                borderColor: 'transparent', // Remove the border color of the arcs
            },
        },
    };

    return (
        <div>
            <PolarArea data={chartData} options={options} />
        </div>
    );
};

export default NightingaleChart;

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './BarGraph.css';

const BarGraph = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (data.length === 0) return;
        const labels = data.map(item => item.name);
        const weights = data.map(item => item.weight);

        const ctx = chartRef.current.getContext('2d');
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Weight',
                    data: weights,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                animation: {
                    duration: 1000, // Set the animation duration in milliseconds
                },
            },
        });
    }, [data]);

    return (
        <div className="graph-container">
            <div className="graph-title">Bar Graph</div>
            <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
    );
};

export default BarGraph;

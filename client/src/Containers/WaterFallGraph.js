import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './WaterFallGraph.css';

const WaterFallGraph = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (data.length === 0) return;
        const labels = data.map(item => item.name);
        const cost = data.map(item => item.cost);
        const cumulativeCosts = cost.reduce((acc, value) => {
            acc.push(acc.length === 0 ? value : acc[acc.length - 1] + value);
            return acc;
        }, []);
        const totalCost = cumulativeCosts[cumulativeCosts.length - 1];


        const ctx = chartRef.current.getContext('2d');
        // Destroy existing chart instance before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [...labels, 'Total'],
                datasets: [{
                    label: 'Waterfall',
                    data: [...cumulativeCosts, totalCost],
                    backgroundColor: [...cost.map(value => value > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'), 'rgba(75, 192, 192, 0.6)'],
                    borderColor: [...cost.map(value => value > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'), 'rgba(75, 192, 192, 1)'],
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
        <div className="waterfall-container">
            <div className="waterfall-title">Waterfall Graph</div>
            <canvas ref={chartRef} width="400" height="200"></canvas>
        </div>
    );
};

export default WaterFallGraph;

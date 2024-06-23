import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { FormGroup, Label, Input } from 'reactstrap';

const SPCChartHist = ({ spc_data }) => {
    const [numberOfBins, setNumberOfBins] = useState(10);
    const [smoothnessLevel, setSmoothnessLevel] = useState(1); // Added smoothnessLevel state
    const [bins, setBins] = useState([]);
    const [curvePoints, setCurvePoints] = useState([]);

    // Calculate mean and standard deviation
    const mean = spc_data.reduce((acc, item) => acc + item.entry, 0) / spc_data.length;
    const variance = spc_data.reduce((acc, item) => acc + Math.pow(item.entry - mean, 2), 0) / spc_data.length;
    const stdDev = Math.sqrt(variance);

    // Normal distribution function with smoothness control
    const normalDistribution = (x, mean, stdDev, smoothness) => {
        return (
            (1 / (stdDev * Math.sqrt(2 * Math.PI * smoothness))) *
            Math.exp(-0.5 * Math.pow((x - mean) / (stdDev * Math.sqrt(smoothness)), 2))
        );
    };

    // Find the min and max values of your data
    const minValue = Math.min(...spc_data.map(item => item.entry));
    const maxValue = Math.max(...spc_data.map(item => item.entry));
    const binWidth = (maxValue - minValue) / numberOfBins; // Moved outside useEffect

    useEffect(() => {
        // Initialize and populate the bins with the frequency counts
        let newBins = new Array(numberOfBins).fill(0);
        spc_data.forEach(item => {
            const binIndex = Math.floor((item.entry - minValue) / binWidth);
            newBins[binIndex < newBins.length ? binIndex : newBins.length - 1]++;
        });

        // Calculate the points for the normal distribution curve with smoothness control
        let newCurvePoints = [];
        for (let i = minValue; i <= maxValue; i += binWidth) {
            const density = normalDistribution(i, mean, stdDev, smoothnessLevel) * binWidth * spc_data.length;
            newCurvePoints.push({ x: i, y: density });
        }

        setBins(newBins);
        setCurvePoints(newCurvePoints);
    }, [numberOfBins, spc_data, binWidth, mean, stdDev, minValue, maxValue, smoothnessLevel]); // Added smoothnessLevel to the dependency array

    // Function to handle change in dropdown for number of bins
    const handleBinChange = event => {
        setNumberOfBins(parseInt(event.target.value, 10));
    };

    // Function to handle change in dropdown for smoothness level
    const handleSmoothnessChange = event => {
        setSmoothnessLevel(parseFloat(event.target.value));
    };

    // Create the data for the histogram and normal distribution curve
    const data = {
        labels: Array.from({ length: numberOfBins }, (_, i) => `${(minValue + i * binWidth).toFixed(2)} - ${(minValue + (i + 1) * binWidth).toFixed(2)}`),
        datasets: [
            {
                label: 'Histogram',
                data: bins,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                type: 'bar',
            },
            {
                label: 'Normal Distribution Curve',
                data: curvePoints,
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                type: 'line',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <FormGroup>
                <Label for="bins">Number of Bins:</Label>
                <Input type="select" id="bins" value={numberOfBins} onChange={handleBinChange}>
                    {[5, 10, 15, 20].map(binSize => (
                        <option key={binSize} value={binSize}>
                            {binSize}
                        </option>
                    ))}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="smoothness">Smoothness Level:</Label>
                <Input
                    type="select"
                    id="smoothness"
                    value={smoothnessLevel}
                    onChange={handleSmoothnessChange}
                >
                    {[1, 2, 3].map(level => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </Input>
            </FormGroup>
            <Bar data={data} options={options} />
        </>
    );
};

export default SPCChartHist;

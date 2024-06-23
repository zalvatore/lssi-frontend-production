import React from 'react';
import { Line } from 'react-chartjs-2';

const SPCChart = ({ spc_data, controlLimitCalc }) => {
  // Calculate the average and standard deviation for the entire dataset
  const sum = spc_data.reduce((acc, item) => acc + item.entry, 0);
  const average = sum / spc_data.length;
  const variance = spc_data.reduce((acc, item) => acc + Math.pow(item.entry - average, 2), 0) / spc_data.length;
  const stdDeviation = Math.sqrt(variance);

  // Create datasets for original average, +3 sigma, and -3 sigma
  const originalAverageLine = new Array(spc_data.length).fill(average);
  const originalUpperSigmaLine = new Array(spc_data.length).fill(average + 3 * stdDeviation);
  const originalLowerSigmaLine = new Array(spc_data.length).fill(average - 3 * stdDeviation);

  // Filter the last 'controlLimitCalc' data points
  const filteredData = spc_data.slice(-controlLimitCalc);

  // Calculate the average and standard deviation for the filtered data
  const filteredSum = filteredData.reduce((acc, item) => acc + item.entry, 0);
  const filteredAverage = filteredSum / filteredData.length;
  const filteredVariance = filteredData.reduce((acc, item) => acc + Math.pow(item.entry - filteredAverage, 2), 0) / filteredData.length;
  const filteredStdDeviation = Math.sqrt(filteredVariance);

  // Create datasets for filtered average, +3 sigma, and -3 sigma
  const filteredAverageLine = new Array(spc_data.length).fill(filteredAverage);
  const filteredUpperSigmaLine = new Array(spc_data.length).fill(filteredAverage + 3 * filteredStdDeviation);
  const filteredLowerSigmaLine = new Array(spc_data.length).fill(filteredAverage - 3 * filteredStdDeviation);

  const data = {
    labels: spc_data.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: 'SPC Data',
        data: spc_data.map(item => item.entry),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Central Line',
        data: filteredAverageLine,
        fill: false,
        borderColor: 'rgb(255, 165, 0)', // Orange color
      },
      {
        label: 'LCL',
        data: filteredLowerSigmaLine, // LCL line
        fill: '+1',
        borderColor: 'rgb(0, 128, 0)', // Green color
        backgroundColor: 'rgba(255,193,8,0.2)',
        borderDash: [5, 5]
      },
      {
        label: 'UCL',
        data: filteredUpperSigmaLine,
        fill: false,
        borderColor: 'rgb(255, 0, 0)', // Red color
        borderDash: [5, 5]
      },
      {
        label: 'Mean',
        data: originalAverageLine,
        fill: false,
        borderColor: 'rgb(0, 0, 255)', // Blue color
        borderDash: [5, 5]
      },
      {
        label: '+3 Sigma',
        data: originalUpperSigmaLine,
        fill: false,
        borderColor: 'rgb(128, 0, 128)', // Purple color
        borderDash: [5, 5]
      },
      {
        label: '-3 Sigma',
        data: originalLowerSigmaLine,
        fill: false,
        borderColor: 'rgb(255, 140, 0)', // Dark Orange color
        borderDash: [5, 5]
      },
      
    ]
  };

  return <Line data={data} />;
};

export default SPCChart;

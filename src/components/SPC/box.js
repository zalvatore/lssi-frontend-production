import React from 'react';
import { Chart as ChartJS } from 'react-chartjs-2';

const SPCChartBox = ({spc_data}) => {
    console.log('test',spc_data); 
  // Convert the data into a format suitable for the boxplot
  const entryValues = spc_data.map(item => item.entry);

  const boxplotData = {
    labels: ' ',
    datasets: [{
      label: 'SPC Data',
      backgroundColor: 'rgba(0,123,255,0.5)',
      borderColor: 'blue',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 3,
      data:  [entryValues],
    }]
  };

  // Define options for the boxplot
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return <ChartJS type='boxplot' data={boxplotData} options={options} />;
};

export default SPCChartBox;

import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import {API_URL_movimientos_semana} from "../../constants";


class ChartComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
      };
    }
  
    componentDidMount() {
      this.getData();
    }
  
    getData = () => {
      const token = Cookies.get("token");
      const headers = { Authorization: `Token ${token}` };
      axios
        .get(API_URL_movimientos_semana, { headers })
        .then((res) => {
          const jsonData = res.data;
  
          // Group data by 'cuenta'
          const groupedData = jsonData.reduce((acc, item) => {
            if (!acc[item.cuenta]) {
              acc[item.cuenta] = {
                cuenta: item.cuenta,
                labels: [],
                positiveData: [],
                negativeData: [],
                deltaData: [], // Delta data
              };
            }
            acc[item.cuenta].labels.push(`Week ${item.week_number}`);
            acc[item.cuenta].positiveData.push(item.positive_movimiento_sum);
            acc[item.cuenta].negativeData.push(Math.abs(item.negative_movimiento_sum));
            // Calculate delta and push it to deltaData
            const delta = item.positive_movimiento_sum + item.negative_movimiento_sum;
            acc[item.cuenta].deltaData.push(delta);
            return acc;
          }, {});
  
          const charts = Object.values(groupedData);
  
          this.setState({
            data: charts,
          });
        })
        .catch((error) => console.log(error));
    };
  
    render() {
      return (
        <div className="chart-container">
          {this.state.data.map((chartData) => (
            <div key={chartData.cuenta} className="chart">
              <h2>Cuenta {chartData.cuenta}</h2>
              <Bar
                data={{
                  labels: chartData.labels,
                  datasets: [
                    {
                      label: 'Positive Movimiento Sum',
                      data: chartData.positiveData,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Negative Movimiento Sum',
                      data: chartData.negativeData,
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Delta',
                      data: chartData.deltaData,
                      type: 'line',
                      fill: false,
                      borderColor: 'rgba(0, 0, 0, 1)',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Weeks',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Values',
                      },
                    },

                  },
                }}
              />
            </div>
          ))}
        </div>
      );
    }
  }
  
  export default ChartComponent;
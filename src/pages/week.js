import React, { Component } from "react";
import ChartComponent from "../components/Charts/ChartComponent.js"


class WeekChart extends Component {

  render() {
    return (
        <div className="App">
          <h1>Ingresos y Gastos</h1>
          <ChartComponent />
        </div>
      );
  }
}

export default WeekChart;
import React, { Component } from "react";
import Header from "./components/HeaderNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Authorized from "./components/Auth";
import Cookies from "js-cookie";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

// Global registration
Chart.register(BoxPlotController, BoxAndWiskers);

class App extends Component {
  render() {
    const isUserAuthenticated = !!Cookies.get("user"); // Check if user cookie exists

    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Header />
          </div>
          <div
            className="container"
            style={{ marginTop: "125px", marginBottom: "50px" }}
          >
            <Routes>
              {isUserAuthenticated ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Authorized />} />
                </>
              )}
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
import React, { Component } from "react";
import Header from "./components/HeaderNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Clientes from "./pages/clientes";
import Partners from "./pages/partners";
import Proyectos from "./pages/proyectos";
import Productos from "./pages/productos";
import Costo from "./pages/costos";
import Sede from "./pages/sede";
import DetlleProyectos from "./pages/detalle_proyecto";
import Movimiento from "./pages/movimientos";
import Authorized from "./components/Auth";
import Cookies from "js-cookie";
import MultiCom from "./pages/multiCom";
import EstadoInstructor from "./pages/estado_instructor";
import Utilidades from "./pages/utilidad";
import WeekChart from "./pages/week";
import BoxScore from "./pages/BoxScore";
import SpcComponent from "./pages/spc";
import Pcc from "./pages/pcc";
import Chart from 'chart.js/auto';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import Project from "./Projects/Project";
import Lideres from "./pages/lideres_proyecto";
import Vendors from "./pages/vendors"; // Import Vendors page

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
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/costos" element={<Costo />} />
                  <Route path="/proyectos" element={<Proyectos />} />
                  <Route path="/sedes" element={<Sede />} />
                  <Route path="/auth" element={<Authorized />} />
                  <Route path="/multi_com" element={<MultiCom />} />
                  <Route path="/utilidad" element={<Utilidades />} />
                  <Route path="/detalle_proyectos" element={<DetlleProyectos />} />
                  <Route path="/movimientos" element={<Movimiento />} />
                  <Route path="/estado_instructor" element={<EstadoInstructor />} />
                  <Route path="/BoxScore" element={<BoxScore />} />
                  <Route path="/week" element={<WeekChart />} />
                  <Route path="/spc" element={<SpcComponent />} />
                  <Route path="/proyecto_con_causa" element={<Pcc />} />
                  <Route path="/lideres_proyectos" element={<Lideres />} />
                  <Route path="/project/:projectNumber" element={<Project />} />
                  <Route path="/proveedores" element={<Vendors />} /> 
                </>
              ) : (
                <>
                  <Route path="/" element={<Authorized />} />
                  <Route path="/clientes" element={<Authorized />} />
                  <Route path="/partners" element={<Authorized />} />
                  <Route path="/productos" element={<Authorized />} />
                  <Route path="/costos" element={<Authorized />} />
                  <Route path="/proyectos" element={<Authorized />} />
                  <Route path="/sedes" element={<Authorized />} />
                  <Route path="/multi_com" element={<Authorized />} />
                  <Route path="/utilidad" element={<Authorized />} />
                  <Route path="/detalle_proyectos" element={<Authorized />} />
                  <Route path="/movimientos" element={<Authorized />} />
                  <Route path="/estado_instructor" element={<Authorized />} />
                  <Route path="/BoxScore" element={<Authorized />} />
                  <Route path="/week" element={<Authorized />} />
                  <Route path="/spc" element={<Authorized />} />
                  <Route path="/proyecto_con_causa" element={<Authorized />} />
                  <Route path="/lideres_proyectos" element={<Authorized />} />
                  <Route path="/project/:projectNumber" element={<Project />} />
                  <Route path="/proveedores" element={<Authorized />} /> 
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
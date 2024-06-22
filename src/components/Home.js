import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import BarChart from "./Charts/Bar/Barchart";
import { API_URL, API_URL_proyectos, API_URL_partners } from "../constants";

class Home extends Component {
  state = {
    clients: [],
    proyectos: [],
    equipo: [],
    proyectosActivos: [],
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Numero de Clientes",
          data: [],
          backgroundColor: [
            "rgba(75,192,192,1)",
          ],
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    },
  };

  componentDidMount() {
    this.resetState();
  }

  getClients = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL, { headers })
      .then(res => this.setState({ clients: res.data }))
      .catch(error => console.log(error));
  };

  getEquipo = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_partners, { headers })
      .then(res => this.setState({ equipo: res.data }))
      .catch(error => console.log(error));
  };

  getProyectos = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_proyectos, { headers })
      .then(res => this.setState({ proyectos: res.data }))
      .catch(error => console.log(error));
  };

  getActiveProyectos = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_proyectos, { headers })
      .then(res => {
        // Filter the projects where activo is true
        const proyectosActivo = res.data.filter(proyecto => proyecto.status === 'Activo');
        this.setState({ proyectosActivos: proyectosActivo });
        console.log("Proyectos fetched successfully:", proyectosActivo);
      })
      .catch(error => console.log("Error fetching proyectos:", error));
  };

  getClientsByciudad = () => {
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL, { headers }) // Assuming API_URL provides client data with ciudad information
      .then((res) => {
        // Filter out data where ciudad is null
        const filteredData = res.data.filter((client) => client.ciudad !== null);
  
        // Calculate the number of clients per ciudad
        const ciudadCounts = {};
        filteredData.forEach((client) => {
          const ciudad = client.ciudad;
          ciudadCounts[ciudad] = (ciudadCounts[ciudad] || 0) + 1;
        });
  
        // Update the chart data with ciudad names and client counts
        const chartData = {
          labels: Object.keys(ciudadCounts),
          datasets: [
            {
              label: "Number of Clients por Ciudad",
              data: Object.values(ciudadCounts),
              backgroundColor: ["rgba(75,192,192,1)"],
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        };
  
        this.setState({ clients: filteredData, chartData });
      })
      .catch((error) => console.log(error));
  };
  
  

  resetState = () => {
    this.getClients();
    this.getProyectos();
    this.getActiveProyectos();
    this.getEquipo();
    this.getClientsByciudad(); 
  };

  render() {
    const { clients, proyectos, proyectosActivos, equipo, chartData } = this.state;

    const clientCount = clients.length;
    const proyectosCount = proyectos.length;
    const proyectosActivoCount = proyectosActivos.length;
    const equipoCount = equipo.length;

    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Lean Six Sigma Institute App</h1>
        <Row>
          <Col>
            <h3>Numero de clientes: {clientCount}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Miembros del equipo: {equipoCount}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Numero de proyectos: {proyectosCount}</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Numero de proyectos Activos: {proyectosActivoCount}</h3>
            <div style={{ width: 800 }}>
              <BarChart chartData={chartData} />
            </div>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default Home;
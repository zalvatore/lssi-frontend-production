import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import ProyectoList from "../components/Proyecto/ProyectoList";
import NewProyectoModal from "../components/Proyecto/NewProyectoModal";
import axios from "axios";
import { API_URL_proyectos } from "../constants";
import Cookies from "js-cookie";

class Proyectos extends Component {
  state = {
    proyectos: []
  };

  componentDidMount() {
    this.resetState();
  }

  getProyectos = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_proyectos, { headers })
      .then(res => {
        this.setState({ proyectos: res.data });
        console.log("Proyectos fetched successfully:", res.data); // Adding console log here
      })
      .catch(error => console.log("Error fetching proyectos:", error));
  };

  resetState = () => {
    this.getProyectos();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Proyectos</h1>
        <Row>
          <Col>
            <ProyectoList
              proyectos={this.state.proyectos}
              resetState={this.resetState}
              itemsPerPage={10}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewProyectoModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Proyectos;
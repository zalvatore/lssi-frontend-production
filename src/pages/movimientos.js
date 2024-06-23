import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import MovimientoList from "../components/Movimiento/MovimientoList";
//import NewSedeModal from "../components/Sede/NewSedeModal";
import axios from "axios";
import { API_URL_movimientos } from "../constants";
import Cookies from 'js-cookie';

class Movimiento extends Component {
  state = {
    movimientos: []
  };

  componentDidMount() {
    this.resetState();
  }

  getData = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_movimientos, { headers })
      .then(res => this.setState({ movimientos: res.data }))
      .catch(error => console.log(error));
  };

  resetState = () => {
    this.getData();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Movimientos Bancarios</h1>
        <Row>
          <Col>
            <MovimientoList
              movimientos={this.state.movimientos}
              resetState={this.resetState}
              itemsPerPage={40}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Movimiento;
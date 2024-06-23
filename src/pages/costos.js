import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import CostoList from "../components/Costos/CostoList.js";
import NewCostoModal from "../components/Costos/NewCostoModal.js";
import axios from "axios";
import { API_URL_costos } from "../constants";
import Cookies from "js-cookie";

class Costo extends Component {
  state = {
    costos: []
  };

  componentDidMount() {
    this.resetState();
  }

  getData = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_costos, { headers })
    .then(res => this.setState({ costos: res.data }))
    .catch(error => console.log(error));
  };

  resetState = () => {
    this.getData();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Costos Directos</h1>
        <Row>
          <Col>
            <CostoList
              costos={this.state.costos}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewCostoModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Costo;
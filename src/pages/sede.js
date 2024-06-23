import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import SedeList from "../components/Sede/SedeList";
import NewSedeModal from "../components/Sede/NewSedeModal";
import axios from "axios";
import { API_URL_sedes } from "../constants";
import Cookies from "js-cookie";

class Sede extends Component {
  state = {
    sedes: []
  };

  componentDidMount() {
    this.resetState();
  }

  getSedes = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_sedes, { headers })
    .then(res => this.setState({ sedes: res.data }))
    .catch(error => console.log(error));
  };

  resetState = () => {
    this.getSedes();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Value Streams</h1>
        <Row>
          <Col>
            <SedeList
              sedes={this.state.sedes}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewSedeModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Sede;
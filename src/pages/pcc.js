import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import PCCList from "../components/Proyecto_Con_Causa/PCCList.js";
import PCCModal from "../components/Proyecto_Con_Causa/PCCModal.js";
import axios from "axios";
import { API_URL_proyecto_con_causa } from "../constants/index.js";
import Cookies from "js-cookie";

class Pcc extends Component {
  state = {
    costos: []
  };

  componentDidMount() {
    this.resetState();
  }

  getData = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_proyecto_con_causa, { headers })
    .then(res => this.setState({ costos: res.data }))
    .catch(error => console.log(error));
  };

  resetState = () => {
    this.getData();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Proyecto Con Causa (PCC)</h1>
        <Row>
          <Col>
            <PCCList
              costos={this.state.costos}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <PCCModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Pcc;
import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import ClientList from "../components/Client/ClientList";
import NewClientModal from "../components/Client/NewClientModal";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL } from "../constants";

class Clientes extends Component {
  state = {
    clients: []
  };

  componentDidMount() {
    this.resetState();
  }
  
  getClients = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL, { headers })
      .then(res => this.setState({ clients: res.data }))
      .catch(error => console.error("Error fetching clients:", error));
  };

  

  resetState = () => {
    this.getClients();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Clientes</h1>
        <Row>
          <Col>
            <ClientList
              clients={this.state.clients}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewClientModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Clientes;
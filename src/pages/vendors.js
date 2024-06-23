import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import VendorList from "../components/Vendor/VendorList";
import NewVendorModal from "../components/Vendor/NewVendorModal";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL_vendors } from "../constants";

class Vendors extends Component {
  state = {
    vendors: []
  };

  componentDidMount() {
    this.resetState();
  }
  
  getVendors = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_vendors, { headers })
      .then(res => this.setState({ vendors: res.data }))
      .catch(error => console.error("Error fetching vendors:", error));
  };

  resetState = () => {
    this.getVendors();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Proveedores</h1>
        <Row>
          <Col>
            <VendorList
              vendors={this.state.vendors}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewVendorModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Vendors;
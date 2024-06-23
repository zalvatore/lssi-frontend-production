import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL } from "../constants";
import ControlChartManager from "../components/SPC/ControlChartManager"


class SpcComponent extends Component { 
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
            <h1>SPC</h1>
            <Row>
              <Col>
                <h2>
                    <ControlChartManager />
                </h2>

              </Col>
            </Row>
          </Container>
        );
      }


}
export default SpcComponent;
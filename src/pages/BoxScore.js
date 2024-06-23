import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import BoxscoreTableComponent from "../components/BoxScore/boxscore_table";
import axios from "axios";
import Cookies from 'js-cookie';
import { 
  API_URL,
  API_URL_movimiento_summary,
  API_URL_BoxScore,
  API_URL_BoxScoreAll
 } from "../constants";
import BoxscoreTableComponentVS from "../components/BoxScore/boxscore_table_vs";

class BoxScore extends Component { 
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

      getMovimientos = () => {
        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` };
        axios.get(API_URL_movimiento_summary, { headers })
          .then(res => this.setState({ movimientos: res.data }))
          .catch(error => console.error("Error fetching movimientos:", error));
      };

      getBoxScore = () => {
        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` };
        axios.get(API_URL_BoxScore, { headers })
          .then(res => this.setState({ BoxScore: res.data }))
          .catch(error => console.error("Error fetching BoxScore:", error));
      };

      getBoxScoreAll = () => {
        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` };
        axios.get(API_URL_BoxScoreAll, { headers })
          .then(res => this.setState({ BoxScoreAll: res.data }))
          .catch(error => console.error("Error fetching BoxScoreAll:", error));
      };
    
      resetState = () => {
        this.getClients();
        this.getMovimientos();
        this.getBoxScore();
        this.getBoxScoreAll();
      };
    
      render() {
        return (
          <Container style={{ marginTop: "20px" }}>
            <h1>Box Score</h1>
            <Row>
              <Col>
                <BoxscoreTableComponent
                clients={this.state.clients}
                movimientos={this.state.movimientos}
                BoxScoreAll={this.state.BoxScoreAll}
                resetState={this.resetState}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <BoxscoreTableComponentVS
                clients={this.state.clients}
                movimientos={this.state.movimientos}
                BoxScore={this.state.BoxScore}
                resetState={this.resetState}
                //VS='eu'
                />
              </Col>
            </Row>
          </Container>
        );
      }


}
export default BoxScore;
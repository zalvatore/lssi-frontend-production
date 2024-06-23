import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import ProductoList from "../components/Producto/ProductoList";
import NewProductoModal from "../components/Producto/NewProductoModal";
import axios from "axios";
import { API_URL_productos } from "../constants";
import Cookies from "js-cookie";

class Productos extends Component {
  state = {
    productos: []
  };

  componentDidMount() {
    this.resetState();
  }

  getproductos = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_productos, { headers })
    .then(res => this.setState({ productos: res.data }))
    .catch(error => console.log(error));
  };

  resetState = () => {
    this.getproductos();
  };

  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Productos</h1>
        <Row>
          <Col>
            <ProductoList
              productos={this.state.productos}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewProductoModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Productos;
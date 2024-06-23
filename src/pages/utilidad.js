import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import axios from "axios";
import { API_URL_utilidad } from "../constants";  // changed to uppercase naming convention
import Cookies from "js-cookie";
import UtilidadList from "../components/Utilidades/UtilidadList";

class Utilidades extends Component {
    constructor(props) {
        super(props);
        this.state = {
            utilidades: []
        };
    }

    componentDidMount() {
        this.getUtilidades();
    }

    getUtilidades = () => {
        const token = Cookies.get("token");
        const headers = { Authorization: `Token ${token}` };

        axios.get(API_URL_utilidad, { headers })
        .then(({ data }) => {   // using destructuring here
            this.setState({ utilidades: data });
        })
        .catch(error => {
            console.log(error);
            // TODO: Handle error (maybe set a state and display an error message to the user)
        });
    }

    resetState = () => {
        this.getUtilidades();
    };

    render() {
        return (
            <div>
                <Container style={{ marginTop: "20px" }}>
                    <h1>Utilidades</h1>
                    <Row>
                        <Col>
                            <UtilidadList
                                utilidades={this.state.utilidades}
                                resetState={this.resetState}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Utilidades;

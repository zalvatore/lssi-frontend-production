import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_partidas_curso } from "../../../constants";

class CursoCerradoFrom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pk: '',
      //estudiante: '',
      cantidad: '',
      costo: '',
      referencia: '',
      moneda: '',
      proyecto_code: '',
    };
  }

  componentDidMount() {
    if (this.props.estudiante) {
      const { 
        pk,
        estudiante,
        cantidad,
        costo,
        referencia,
        moneda,
        proyecto_code,
      } = this.props.estudiante;
      this.setState({ 
        pk,
        estudiante,
        cantidad,
        costo,
        moneda,
        referencia,
        proyecto_code,
      });

      
    }

      const proyectoCodeFrom = this.props.proyectoCode;
      this.setState({ proyecto_code: proyectoCodeFrom }); 
    
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleNumericInput = e => {
    const { name, value } = e.target;
    
    // Regular expression to match numbers with or without decimals
    const regex = /^\d*\.?\d*$/;
    
    // If the input value matches the regex or it's an empty string, update state
    if (value === '' || regex.test(value)) {
      this.setState({ [name]: value });
    }
  };

  createPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    axios.post(API_URL_partidas_curso, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
        this.setState({ errorMessage:'Error adding partida2.' });
        console.error("Error adding partida2:", error);
    });
  };

  editPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    axios.put(API_URL_partidas_curso + this.state.pk, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      this.setState({ errorMessage:'Error editing partida2.' });
      console.error("Error editing partida2:", error);
      //console.log("this.state", this.state);
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {
    const {errorMessage } = this.state;
    const proyectoCodeFrom = this.props.proyectoCode
    const proyectoNameFrom = this.props.proyectoName
    const h3Style = {
        color: 'blue' // Change the color to your desired value
      };
  
    return (
        <div>
            <h3>{proyectoNameFrom}</h3>
            {proyectoCodeFrom && 
            <h3 style={h3Style}>{proyectoCodeFrom.toUpperCase()}</h3>
            }
        <Form onSubmit={this.props.estudiante ? this.editPartida : this.createPartida}>
        <FormGroup>
              <Label for="cantidad">Numero de estudiantes:</Label>
                <Input
                    type="number"
                    name="cantidad"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.cantidad)}
                />
              </FormGroup>
            <FormGroup>
            <Label for="costo">Precio x estudiante:</Label>
              <Input
                  type="numeric"
                  name="costo"
                  onChange={this.onChange}
                  value={this.defaultIfEmpty(this.state.costo)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="moneda">Moneda:</Label>
                <Input
                  type="select"
                  name="moneda"
                  value={this.defaultIfEmpty(this.state.moneda)}
                  onChange={this.onChange}
                  className="form-control"
                >
                  <option value="">Selecciona moneda</option>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="referencia">Referencia:</Label>
              <Input
                type="text"
                name="referencia"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.referencia)}
              />
            </FormGroup>
            
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default CursoCerradoFrom;
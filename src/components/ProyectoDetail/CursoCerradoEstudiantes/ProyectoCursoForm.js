import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_partidas_curso } from "../../../constants";
import Cookies from 'js-cookie';

class ProyectoCursoForm extends React.Component {

  state = {
    pk: 0,
    partida_curso: "", // Add state property for Horas x Semana
    //costo: "", // Add state property for Precio x Hora
    errorMessage: "", // Initialize errorMessage in state
    proyecto_code: "",
  };

  componentDidMount() {
    //console.log("partida_curso state:", this.state.partida_curso);
    if (this.props.partida_curso) {
      const {
        pk,
        partida_curso,
        cantidad,
        costo,
        referencia,
        moneda,
        proyecto_code,
      } = this.props.partida_curso;
      this.setState({
        pk,
        partida_curso,
        cantidad,
        costo,
        moneda,
        referencia,
        proyecto_code,
        
      });
      //console.log("partida_curso state in if:", this.state.partida_curso);
      
    }
  
    const proyectoCodeFrom = this.props.proyectoCode;
    this.setState({ proyecto_code: proyectoCodeFrom });
  }
  

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeNumber = e => {
    const name = e.target.name;
    let value = e.target.value;
  
    // Allow empty value or valid decimal number
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      // Update the state with the valid value
      this.setState({ [name]: value, errorMessage: '' }); // Clear error message
    } else {
      // Set error message for invalid input
      this.setState({ errorMessage: 'Invalid decimal number format' });
    }
  };

  createPartidaCurso = e => {
    e.preventDefault();
    //console.log("this.state", this.state);
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_partidas_curso, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
      console.log("this.state", this.state);
    }).catch(error => {
        this.setState({ errorMessage:'Error adding partida.' });
        console.error("Error adding partida del curso:", error);
    });
  };

  editPartidaCurso = e => {
    e.preventDefault();
    //console.log("this.state", this.state);
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_partidas_curso + this.state.pk, this.state, { headers })
    .then(() => {
      console.log("this.state", this.state);
      this.props.resetState();
      this.props.toggle();
      console.log("this.state", this.state);
    }).catch(error => {
      this.setState({ errorMessage:'Error editing partida del curso.' });
      console.error("Error editing partida del curso:", error);
      console.log("this.state", this.state);
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {
    const { errorMessage } = this.state;
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
        <Form onSubmit={this.props.partida_curso ? this.editPartidaCurso : this.createPartidaCurso}>
            <FormGroup>
              <Label for="cantidad">Numero de estudiantes:</Label>
                <Input
                    type="number"
                    name="cantidad"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.cantidad)}
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                />
              </FormGroup>
            <FormGroup>
            <Label for="costo">Precio x estudiante:</Label>
              <Input
                  type="text"
                  name="costo"
                  onChange={this.onChangeNumber}
                  value={this.defaultIfEmpty(this.state.costo)}
                  inputMode="numeric"
                  onWheel={(e) => e.target.blur()}
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

export default ProyectoCursoForm;
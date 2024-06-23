import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_productos } from "../../constants";
import Cookies from 'js-cookie';

class NewProductoForm extends React.Component {

  state = {
    pk: 0,
    producto_code: "",
    nombre: "",
    errorMessage: ''
  };

  componentDidMount() {
    if (this.props.producto) {
      const { 
      pk, 
      producto_code,
      nombre,
      tipo,


      } = this.props.producto;
      this.setState({ 
        pk, 
        producto_code,
        nombre,
        tipo,
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createProducto = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_productos, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => console.log(error));
  };

  editProducto = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_productos + this.state.pk, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating producto.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  render() {

    const { errorMessage, tipo } = this.state;

    return (
      <Form onSubmit={this.props.producto ? this.editProducto : this.createProducto}>
        <FormGroup>
          <Label for="tipo">Tipo:</Label>
            <Input
              type="select"
              name="tipo"
              value={tipo}
              onChange={this.onChange}
              className="form-control"
            >
              <option value="">Selecciona tipo</option>
              <option value="Curso">Curso</option>
              <option value="Libro impreso">Libro impreso</option>
              <option value="Libro digital">Libro digital</option>
              <option value="Manual impreso">Manual impreso</option>
              <option value="Manual digital">Manual digital</option>
              <option value="Licencia">Licencia</option>
              <option value="Otros">Otros</option>
            </Input>
        </FormGroup>
        <FormGroup>
          <Label for="nombre">Producto:</Label>
          <Input
            type="text"
            name="nombre"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre)}
          />
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewProductoForm;
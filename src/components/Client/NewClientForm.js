import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert,} from "reactstrap";
import axios from "axios";
import { API_URL } from "../../constants";
import { API_URL_sedes } from "../../constants";
import Cookies from 'js-cookie';

class NewClientForm extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      //dropdownOpen: false,
      sedes: '',
      selectedSede: '',
      pk: '',
      razon_social: "",
      id_fiscal: "",
      nombre: "",
      giro:"",
      nombre_comprador: "",
      nombre_admin: "",
      email: "",
      phone: "",
      pais: "",
      codigo_postal: "",
      estado: "",
      ciudad: "",
      calle: "",
      client_code:"",
      errorMessage: ''
    };
  }

  componentDidMount() {
    if (this.props.client) {
      const { 
      pk, 
      razon_social,
      id_fiscal,
      nombre,
      giro,
      sede,
      nombre_comprador,
      nombre_admin, 
      email, 
      phone, 
      pais,
      codigo_postal,
      estado,
      ciudad,
      calle,
      client_code,
      } = this.props.client;
      this.setState({ 
        pk, 
        razon_social,
        id_fiscal,
        nombre,
        giro,
        sede,
        nombre_comprador,
        nombre_admin, 
        email, 
        phone, 
        pais,
        codigo_postal,
        estado,
        ciudad,
        calle,
        client_code, 
      });
    }
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_sedes, { headers })
      .then(response => {
        const sedes = response.data;
        this.setState({ sedes });
      })
      .catch(error => {
        console.error('Error fetching Sedes:', error);
      });
  }


  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  createClient = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      this.setState({ errorMessage:'Error adding cliente.' });
      console.error("Error adding cliente:", error.response.data);
  });
    
  };

  editClient = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL + this.state.pk, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating client.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  handleSedeChange = (e) => {
    this.setState({ sede: e.target.value });
  };

  selectSede = sede => {
    this.setState({ selectedSede: sede });
  }

  handleGiroChange = (e) => {
    this.setState({ giro: e.target.value });
  };

  render() {


    const { errorMessage } = this.state;
    const { sede, sedes, giro } = this.state;

    return (
      <Form onSubmit={this.props.client ? this.editClient : this.createClient}>
        <FormGroup>
          <Label for="razon_social">Razon Social:</Label>
          <Input
            type="text"
            name="razon_social"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.razon_social)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="id_fiscal">Id Fiscal:</Label>
          <Input
            type="text"
            name="id_fiscal"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.id_fiscal)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="nombre">Nombre Comerical:</Label>
          <Input
            type="text"
            name="nombre"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre)}
          />
        </FormGroup>
        <FormGroup>
            <Label for="giro">Giro:</Label>
            <Input
              type="select"
              name="giro"
              value={giro}
              onChange={this.handleGiroChange}
              className="form-control"
            >
              <option value="">Selecciona Giro</option>
              <option value="Manufactura">Manufactura</option>
              <option value="Servicios">Servicios</option>
              <option value="Logística">Logística</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Agricultura">Agricultura</option>
              <option value="Construcción">Construcción</option>
              <option value="Gobierno">Gobierno</option>
              <option value="Bancos">Bancos</option>
              <option value="Otro">Otro</option>
            </Input>
        </FormGroup>
        <FormGroup>
          <Label for="sede">Selecciona Sede</Label>
          <Input
            type="select"
            name="sede"
            value={sede}
            onChange={this.handleSedeChange}
          >
            <option value="">Sede:</option>
            {Array.isArray(sedes) && sedes.map(sede => (
              <option key={sede.id} value={sede.sede}>
                {sede.sede}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="nombre_comprador">Nombre Comprador:</Label>
          <Input
            type="text"
            name="nombre_comprador"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre_comprador)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="nombre_admin">Nombre C x P:</Label>
          <Input
            type="text"
            name="nombre_admin"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre_admin)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Correo:</Label>
          <Input
            type="email"
            name="email"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.email)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Telefono:</Label>
          <Input
            type="text"
            name="phone"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.phone)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="pais">Pais:</Label>
          <Input
            type="text"
            name="pais"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.pais)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="codigo_postal">Codigo Postal:</Label>
          <Input
            type="text"
            name="codigo_postal"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.codigo_postal)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="estado">Estado:</Label>
          <Input
            type="text"
            name="estado"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.estado)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="ciudad">Ciudad:</Label>
          <Input
            type="text"
            name="ciudad"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.ciudad)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="calle">Calle y Numero:</Label>
          <Input
            type="text"
            name="calle"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.calle)}
          />
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewClientForm;
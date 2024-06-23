import React from "react";
import { 
  Button, 
  Form, 
  FormGroup, 
  Input, 
  Label, 
  Alert, 
} from "reactstrap";
import axios from "axios";
import { API_URL_proyecto_con_causa } from "../../constants";
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

class PCCForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.token = Cookies.get("token");
    this.headers = { Authorization: `Token ${this.token}` };
  }

  state = {
    pk: 0,
    nombre: "",
    nombre_contacto:'',
    email:'',
    phone:'',
    ciudad:'',
    pais:'',
    observaciones:'',
    errorMessage: '',
    dropdownOpen: false
  };

  componentDidMount() {
    if (this.props.costo) {
      const { 
      pk, 
      nombre,
      nombre_contacto,
      email,
      phone,
      ciudad,
      pais,
      observaciones,
      } = this.props.costo;
      this.setState({ 
        pk, 
        nombre,
        nombre_contacto,
        email,
        phone,
        ciudad,
        pais,
        observaciones,
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  create = e => {
    e.preventDefault();
    axios.post(API_URL_proyecto_con_causa, this.state, { headers: this.headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error al crear PCC.' });
      });
  };

  edit = e => {
    e.preventDefault();
    axios.put(API_URL_proyecto_con_causa + this.state.pk, this.state, { headers: this.headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating PCC.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };


  render() {

    const { 
      errorMessage,
    } = this.state;

    return (
      <Form onSubmit={this.props.costo ? this.edit : this.create}>
        <FormGroup>
          <Label for="nombre">Nombre:</Label>
          <Input
            type="text"
            name="nombre"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="nombre_contacto">Nombre Contacto:</Label>
          <Input
            type="text"
            name="nombre_contacto"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nombre_contacto)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email:</Label>
          <Input
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.email)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Phone:</Label>
          <Input
            type="text"
            name="phone"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.phone)}
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
          <Label for="pais">Pais:</Label>
          <Input
            type="text"
            name="pais"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.pais)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="observaciones">Observaciones:</Label>
          <Input
            type="text"
            name="observaciones"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.observaciones)}
          />
        </FormGroup>
        
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default PCCForm;
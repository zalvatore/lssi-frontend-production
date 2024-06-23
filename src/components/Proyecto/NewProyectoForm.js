import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_proyectos } from "../../constants";
import { API_URL_partners } from "../../constants";
import { API_URL_productos } from "../../constants";
import { API_URL } from "../../constants";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

class NewProyectoForm extends React.Component {

  state = {
    pk: 0,
    proyecto_code: "",
    producto: "",
    tipi: '',
    name: "",
    cliente :"",
    inicio_date: "",
    terminacion_date: "",
    traifa_hora: "",
    moneda: "",
    errorMessage: '',
    errorMessageFecha:'',
    clientes: [],
    productos: [],
    partners: [],
  };

  componentDidMount() {
    if (this.props.proyecto) {
      const { 
      pk,
      status, 
      proyecto_code,
      producto,
      productos,
      tipo,
      cliente,
      clientes,
      modalidad,
      name,
      inicio_date,
      terminacion_date,
      preventa,
      venta,
      posventa,
      lider,
      moneda,
      } = this.props.proyecto;

      const formattedInicioDate = inicio_date ? new Date(inicio_date) : null;
      const formattedTerminacionDate = terminacion_date ? new Date(terminacion_date) : null;

      this.setState({ 
        pk, 
        status,
        proyecto_code,
        producto,
        productos,
        tipo,
        cliente,
        clientes,
        modalidad,
        name,
        inicio_date: formattedInicioDate,
        terminacion_date: formattedTerminacionDate,
        preventa,
        venta,
        posventa,
        lider,
        moneda,
      });
    }

    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_partners, { headers })
      .then(response => {
        const partners = response.data;
        this.setState({ partners });
      })
      .catch(error => {
        console.error('Error fetching equipo:', error);
      });

    axios.get(API_URL_productos, { headers })
      .then(response => {
        const productos = response.data;
        this.setState({ productos });
      })
      .catch(error => {
        console.error('Error fetching productos:', error);
      });

      axios.get(API_URL, { headers })
      .then(response => {
        const clientes = response.data;
        this.setState({ clientes });
      })
      .catch(error => {
        console.error('Error fetching clientes:', error);
      });

    

  }

  createProyecto = e => {
    e.preventDefault();

    if (this.state.inicio_date && this.state.terminacion_date && this.state.inicio_date >= this.state.terminacion_date) {
      this.setState({ errorMessageFecha: 'La fecha de terminación debe ser posterior a la fecha de inicio.' });
      return;
    }

    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    axios.post(API_URL_proyectos, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage: error.message || 'Error al crear proyecto.' });
      });
  };

  editProyecto = e => {
    e.preventDefault();

    if (this.state.inicio_date && this.state.terminacion_date && this.state.inicio_date >= this.state.terminacion_date) {
      this.setState({ errorMessageFecha: 'La fecha de terminación debe ser posterior a la fecha de inicio.' });
      return;
    }

    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
  
    axios.put(API_URL_proyectos + this.state.pk, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({  errorMessage: error.message || 'Error updating proyecto.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  constructor(props) {
    super(props);
    this.state = {
      inicio_date: null,
      terminacion_date: null,
      selectedCurrency: '',
      billableHours: '',
      Hours:"",
      currencyOptions: [],
    };
  }

  
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDateChange = (date) => {
    this.setState({ inicio_date: date });
  };

  handleDateChangeTermina = (date) => {
    this.setState({ terminacion_date: date });
  };

  render() {

    const { 
      errorMessage, 
      inicio_date,
      terminacion_date, 
      moneda,
      errorMessageFecha,
      partners,
      productos,
      clientes,
      modalidad,
      cliente,
      producto,
      lider,
      status,
    } = this.state;

    // Sort the status options alphabetically
    const sortedStatusOptions = [
      "Activo",
      "Terminado",
      "En pausa",
      "En negociación",
      "Terminado con Saldo Pendiente",
      "Vencido",
    ].sort();

   // Sort the cliente options alphabetically
  const sortedClienteOptions = clientes && clientes.length > 0
  ? clientes
      .slice() 
      .filter((cliente) => cliente.nombre && cliente.nombre.trim().length > 2) // Trim white spaces
      .sort((a, b) => a.nombre.trim().toLowerCase().localeCompare(b.nombre.trim().toLowerCase())) 
      .map((cliente) => (
        <option key={cliente.id} value={cliente.nombre}>
          {cliente.nombre}
        </option>
      ))
  : [];


    const sortedProductoOptions = productos && productos.length > 0
    ? productos
        .slice() // Create a shallow copy to avoid modifying the original array
        .sort((a, b) => a.nombre.localeCompare(b.nombre)) // Sort alphabetically by 'nombre'
        .map((producto) => (
          <option key={producto.id} value={producto.nombre}>
            {producto.nombre}
          </option>
        ))
    : [];


    // Sort the modalidad options alphabetically
    const sortedModalidadOptions = [
      "Curso Virtual en vivo - Abierto",
      "Curso Virtual en vivo - Cerrado",
      "Curso Online autoguiado - Abierto",
      "Curso Online autoguiado - Cerrado",
      "Curso Presencial - Abierto",
      "Curso Presencial - Cerrado",
      "Curso Híbrido presencial + Virtual - Abierto",
      "Curso Híbrido presencial + Virtual - Cerrado",
      "Coaching",
      "Proyecto de implementación",
      "Certificaciones - Abierto",
      "Certificaciones - Cerrado",
      "Licencias",
    ].sort();

    // Sort the lider options alphabetically
    const sortedLiderOptions = partners && partners.length > 0
    ? partners
        .slice() // Create a shallow copy to avoid modifying the original array
        .sort((a, b) => a.partner.localeCompare(b.partner)) // Sort alphabetically by 'partner'
        .map((partner) => (
          <option key={partner.id} value={partner.partner}>
            {partner.partner}
          </option>
        ))
    : (
        <option value="">No partners available</option>
      );



    // Sort the moneda options alphabetically
    const sortedMonedaOptions = [
      "MXN",
      "USD",
      "EUR",
      "COP",
    ].sort();

    return (
      <Form onSubmit={this.props.proyecto ? this.editProyecto : this.createProyecto}>
        
        <FormGroup>
            <Label for="status">Status:</Label>
            <Input
              type="select"
              name="status"
              value={status}
              onChange={this.onChange}
              className="form-control"
            >
              <option key="0" value="">
                Selecciona Status
              </option>
              {sortedStatusOptions.map((option, index) => (
                <option key={index + 1} value={option}>
                  {option}
                </option>
              ))}
            </Input>
          </FormGroup>
        <FormGroup>
          <Label for="name">Proyecto:</Label>
          <Input
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.name)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="cliente">Selecciona Cliente</Label>
          <Input
            type="select"
            name="cliente"
            value={cliente}
            onChange={this.onChange}
          >
            <option key="0" value="">
              Cliente:
            </option>
            {sortedClienteOptions}
          </Input>
      </FormGroup>


        <FormGroup>
          <Label for="producto">Selecciona Producto</Label>
          <Input
            type="select"
            name="producto"
            value={producto}
            onChange={this.onChange}
          >
            <option key="0" value="">
              Producto:
            </option>
            {sortedProductoOptions}
          </Input>
        </FormGroup>
        <FormGroup>
            <Label for="modalidad">Modalidad:</Label>
            <Input
              type="select"
              name="modalidad"
              value={modalidad}
              onChange={this.onChange}
              className="form-control"
            >
              <option key="0" value="">
                Selecciona Modalidad
              </option>
              {sortedModalidadOptions.map((option, index) => (
                <option key={index + 1} value={option}>
                  {option}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
          <Label for="inicio_date">Fecha inicio:</Label>
          <DatePicker
            name="inicio_date"
            selected={inicio_date}
            onChange={this.handleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de inicio"
            className="form-control"
            value={this.defaultIfEmpty(this.state.inicio_date)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="terminacion_date">Fecha terminacion:</Label>
          <DatePicker
            name="terminacion_date"
            selected={terminacion_date}
            onChange={this.handleDateChangeTermina}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de inicio"
            className="form-control"
            value={this.defaultIfEmpty(this.state.terminacion_date)}
          />
        </FormGroup>
        {errorMessageFecha && <Alert color="danger">{errorMessageFecha}</Alert>}
        <FormGroup>
          <Label for="lider">Selecciona Coaching/Lider</Label>
          <Input
            type="select"
            name="lider"
            value={lider}
            onChange={this.onChange}
          >
            <option key="0" value="">
              Lider:
            </option>
            {sortedLiderOptions}
          </Input>
        </FormGroup>
        <FormGroup>
            <Label for="moneda">Moneda:</Label>
            <Input
              type="select"
              name="moneda"
              value={moneda}
              onChange={this.onChange}
              className="form-control"
            >
              <option key="0" value="">
                Selecciona moneda
              </option>
              {sortedMonedaOptions.map((option, index) => (
                <option key={index + 1} value={option}>
                  {option}
                </option>
              ))}
            </Input>
          </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewProyectoForm;
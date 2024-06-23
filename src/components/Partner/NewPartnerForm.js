import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_partners } from "../../constants";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

class NewPartnerForm extends React.Component {

  state = {
    pk: 0,
    partner_code: "",
    partner: "",
    nivel:'',
    email: "",
    grupo:'',
    localizacion:'',
    ingreso_date:'',
    cumple_date:'',
    errorMessage: ''
  };

  componentDidMount() {
    if (this.props.partner) {
      const { 
      pk, 
      partner_code,
      partner,
      nivel,
      email,
      grupo,
      localizacion,
      ingreso_date,
      cumple_date,
      iva,
      retencion,
      isr,
      } = this.props.partner;

      const formattedIngresoDate = ingreso_date ? new Date(ingreso_date) : null;
      const formattedCumpleDate = cumple_date ? new Date(cumple_date) : null;


      this.setState({ 
        pk, 
        partner_code,
        partner,
        nivel,
        email, 
        grupo,
        localizacion,
        ingreso_date: formattedIngresoDate,
        cumple_date: formattedCumpleDate,
        iva,
        retencion,
        isr,
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createPartner = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_partners, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => console.log(error));
  };

  editPartner = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_partners + this.state.pk, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating partner.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  handleIngresoDateChange = (date) => {
    this.setState({ ingreso_date: date });
  };

  handleCumpleDateChange = (date) => {
    this.setState({ cumple_date: date });
  };

  onChangeNumber = e => {
    const name = e.target.name;
    let value = e.target.value;
  
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      this.setState({ [name]: value, errorMessage: '' });
    } else {
      this.setState({ errorMessage: 'Invalid decimal number format' });
    }
  };

  render() {

    const { errorMessage,
      ingreso_date,
      cumple_date } = this.state;

    return (
      <Form onSubmit={this.props.partner ? this.editPartner : this.createPartner}>
        <FormGroup>
          <Label for="partner">Nombre de miembro:</Label>
          <Input
            type="text"
            name="partner"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.partner)}
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
          <Label for="nivel">Nivel:</Label>
          <Input
            type="text"
            name="nivel"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.nivel)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="grupo">Grupo:</Label>
          <Input
            type="text"
            name="grupo"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.grupo)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="localizacion">Localizacion:</Label>
          <Input
            type="text"
            name="localizacion"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.localizacion)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="iva">IVA:</Label>
            <Input
                type="text"
                name="iva"
                onChange={this.onChangeNumber}
                value={this.defaultIfEmpty(this.state.iva)}
            />
        </FormGroup>
        <FormGroup>
          <Label for="retencion">Retencion IVA:</Label>
            <Input
                type="text"
                name="retencion"
                onChange={this.onChangeNumber}
                value={this.defaultIfEmpty(this.state.retencion)}
            />
        </FormGroup>
        <FormGroup>
          <Label for="isr">Retencion ISR:</Label>
            <Input
                type="text"
                name="isr"
                onChange={this.onChangeNumber}
                value={this.defaultIfEmpty(this.state.isr)}
            />
        </FormGroup>
        <FormGroup>
          <Label for="ingreso_date">Fecha Ingreso:</Label>
          <DatePicker
            name="ingreso_date"
            selected={ingreso_date}
            onChange={this.handleIngresoDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de ingreso"
            className="form-control"
            value={this.defaultIfEmpty(this.state.ingreso_date)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="cumple_date">Cumpleaños:</Label>
          <DatePicker
            name="cumple_date"
            selected={cumple_date}
            onChange={this.handleCumpleDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona fecha de cumpleaños"
            className="form-control"
            value={this.defaultIfEmpty(this.state.cumple_date)}
          />
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewPartnerForm;
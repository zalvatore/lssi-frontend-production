import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_sedes } from "../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';



class NewSedeForm extends React.Component {

  state = {
    pk: 0,
    sede_code: "",
    sede: "",
    errorMessage: ''
  };

  componentDidMount() {
    if (this.props.sede) {
      const { 
      pk, 
      sede_code,
      sede,
      } = this.props.sede;
      this.setState({ 
        pk, 
        sede_code,
        sede,
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createSede = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_sedes, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error al crear sede.' });
      });
  };

  editSede = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_sedes + this.state.pk, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating sede.' });
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
      <Form onSubmit={this.props.sede ? this.editSede : this.createSede}>
        <FormGroup>
          <Label for="sede">Value Stream:</Label>
          <Input
            type="text"
            name="sede"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.sede)}
          />
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewSedeForm;
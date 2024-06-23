import React from "react";
import { 
  Button, 
  Form, 
  FormGroup, 
  Input, 
  Label, 
  Alert, 
  Dropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem } from "reactstrap";
import axios from "axios";
import { API_URL_costos } from "../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

class NewCostoForm extends React.Component {

  state = {
    pk: 0,
    costo_code: "",
    costo: "",
    errorMessage: '',
    dropdownOpen: false
  };

  componentDidMount() {
    if (this.props.costo) {
      const { 
      pk, 
      costo_code,
      costo,
      } = this.props.costo;
      this.setState({ 
        pk, 
        costo_code,
        costo,
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

  createCosto = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_costos, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error al crear costo.' });
      });
  };

  editCosto = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_costos + this.state.pk, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating costo.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };


  render() {

    const { 
      errorMessage, 
      dropdownOpen,
    } = this.state;


    return (
      <Form onSubmit={this.props.costo ? this.editCosto : this.createCosto}>
        <FormGroup>
          <Label for="costo">Costo:</Label>
          <Input
            type="text"
            name="costo"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.costo)}
          />
        </FormGroup>
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
          <Dropdown isOpen={dropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret size="lg">
              Large Button
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem>Action</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewCostoForm;
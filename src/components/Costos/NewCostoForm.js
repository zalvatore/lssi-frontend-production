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
import { API_URL_costos } from "../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';



class NewCostoForm extends React.Component {

  state = {
    pk: 0,
    costo_code: "",
    costo: "",
    asignado_a: '',
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
        
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default NewCostoForm;
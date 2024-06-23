import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL_comision_multi } from "../../../constants";

class IngresoGeneralForm extends React.Component {
  
  state = {
    pk: 0,
    errorMessage: "",
    admin_del_curso:'',
    adminCostPercentage: '',
    pago_por: 'Ingreso en General',
    iva: 0, 
    retencion: 0, 
    isr: 0,
    subcantidad: 0,
    cantidad: 0,
    instructor: 'ingreso en general',
    comision_multi_code: '',
    ingreso_en_general:0,
    moneda: '',
    proyecto_code: '', // Add these
    proyecto: '', // Add these
    mod_user: '', // Add these
  };

  componentDidMount() {
    const { proyectoCode, proyectoName, admin } = this.props;
    const username = Cookies.get("user");
    //const estudiantesIngreso = this.props.estudiantesIngreso 

  
    if (admin) {
      const { 
        pk,
        instructor, 
        moneda,
        proyecto,
        proyecto_code,
        comision_multi_code,
        cantidad,
        iva,
        isr,
        retencion,
        subcantidad 
      } = admin;
      this.setState((prevState) => ({ 
        ...prevState,
        pk: pk,
        admin_del_curso: instructor,
        instructor: instructor,
        moneda: moneda,
        proyectoName: proyecto,
        proyectoCode: proyecto_code,
        comision_multi_code: comision_multi_code,
        cantidad,
        iva,
        isr,
        retencion,
        subcantidad,
        adminCostPercentage: subcantidad /this.props.estudiantesIngreso * 100
      }), () => {
        //console.log("State has been updated successfully.",this.state);
        //console.log('this.props.estudiantesIngreso ',this.props.estudiantesIngreso )
      });
    }
    
  
    this.setState({ 
      proyecto_code: proyectoCode,
      proyecto: proyectoName,
      mod_user: username,
    });
  }

  generateRandomString = (length) => {
    const characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZ23456789';
    const charactersLength = characters.length;
    let random_string = '';

    for (let counter = 0; counter < length; counter++) {
        random_string += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return random_string;
};

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getData= () => {
    const {ingreso_en_general} = this.state;

      this.setState((prevState) => ({
        ...prevState,
        subcantidad: ingreso_en_general,
        cantidad: ingreso_en_general
         
    }))
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };


  createAdmin = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    this.getData()

    // Generate a random string
    const random_string = this.generateRandomString(5);

    this.setState({ comision_multi_code: random_string }, () => {
        axios.post(API_URL_comision_multi, this.state, { headers })
            .then(() => {
                this.props.resetState();
                this.props.toggle();
            })
            .catch(error => {
                this.setState({ errorMessage: 'Error adding Admin.' });
                console.error("Error adding Admin:", error);
            });
    });
};


  editAdmin = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };

    try {
        // Wait for this.getData() to finish before proceeding
        await this.getData();
        await axios.put(API_URL_comision_multi + this.state.pk, this.state, { headers });
        this.props.resetState();
        this.props.toggle();
    } catch (error) {
        console.log(error);
        this.setState({ errorMessage: 'Error updating Ingreso en General' });
    }
  };

  render() {
    const { errorMessage, moneda, ingreso_en_general } = this.state;
    const { proyectoCode, proyectoName, } = this.props;
    const h3Style = { color: 'blue' };

    return (
      <div>
        <h3>{proyectoName}</h3>
        {proyectoCode && <h3 style={h3Style}>{proyectoCode.toUpperCase()}</h3>}
        <Form onSubmit={this.props.admin ? this.editAdmin : this.createAdmin}>
          <FormGroup>
          <Label for="ingreso_en_general">Ingreso en General:</Label>
          <Input
            type="number"
            name="ingreso_en_general"
            onChange={this.onChange}
            value={ingreso_en_general}
          />
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
              <option key='0' value="">Selecciona moneda</option>
              <option key='1' value="MXN">MXN</option>
              <option key='2' value="USD">USD</option>
              <option key='3' value="EUR">EUR</option>
              <option key='4' value="COP">COP</option>
            </Input>
          </FormGroup>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default IngresoGeneralForm;

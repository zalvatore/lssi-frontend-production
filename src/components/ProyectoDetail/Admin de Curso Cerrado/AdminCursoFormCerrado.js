import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL_comision_multi } from "../../../constants";

class AdminCursoFormCerrado extends React.Component {
  
  state = {
    pk: 0,
    errorMessage: "",
    admin_del_curso:'',
    adminCostPercentage: '',
    pago_por: 'Admin de Curso Cerrado',
    iva: 0, 
    retencion: 0, 
    isr: 0,
    subcantidad: 0,
    cantidad: 0,
    instructor: '',
    comision_multi_code: '',
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
    const selectedPartner = this.props.partners.find(partner => partner.partner === this.state.admin_del_curso);
    if (selectedPartner) {
      const { iva, isr, retencion, partner_code,partner } = selectedPartner;
      const subTotal = this.props.estudiantesIngreso * this.state.adminCostPercentage /100;


      this.setState((prevState) => ({
        ...prevState,
        iva,
        isr,
        retencion,
        instructor_code: partner_code,
        subcantidad: subTotal,
        cantidad: subTotal,
        instructor: partner
          }), () => {
              //console.log('Updated state:', this.state);
          });
    }
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
        this.setState({ errorMessage: 'Error updating Admin.' });
    }
  };

  render() {
    const { errorMessage, admin_del_curso, adminCostPercentage, moneda } = this.state;
    const { proyectoCode, proyectoName, partners, estudiantesIngreso } = this.props;
    const h3Style = { color: 'blue' };

    return (
      <div>
        <h3>{proyectoName}</h3>
        {proyectoCode && <h3 style={h3Style}>{proyectoCode.toUpperCase()}</h3>}
        <h5>Ingreso de estudiantes: {estudiantesIngreso?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
        <Form onSubmit={this.props.admin ? this.editAdmin : this.createAdmin}>
          <FormGroup>
            <Label for="admin_del_curso">Admin del Curso:</Label>
            <Input
              type="select"
              name="admin_del_curso"
              value={admin_del_curso}
              onChange={this.onChange}
            >
              <option key='0' value="">Admin:</option>
              {Array.isArray(partners) && partners.map(partner => (
                <option key={partner.pk} value={partner.partner}>
                  {partner.partner}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
          <Label for="adminCostPercentage">Porcentaje:</Label>
          <Input
            type="number"
            name="adminCostPercentage"
            onChange={this.onChange}
            value={adminCostPercentage}
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
          <FormGroup>
            <Label for="costo">Costo de Administracion:</Label>
            <h5>{(estudiantesIngreso * adminCostPercentage / 100)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
          </FormGroup>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default AdminCursoFormCerrado;

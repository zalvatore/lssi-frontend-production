import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import Cookies from 'js-cookie';
import { 
  API_URL_comision_multi,
  API_URL_proyecto_con_causa,  
} from "../../../constants";

class ProyectoConCausaForm extends React.Component {

  constructor(props) {
    super(props);
    
    this.token = Cookies.get("token");
    this.headers = { Authorization: `Token ${this.token}` };
  }
  
  state = {
    pk: 0,
    errorMessage: "",
    admin_del_curso:'',
    adminCostPercentage: '',
    pago_por: 'Proyecto con Causa',
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
    pccs:[]
  };

  componentDidMount() {
    const { proyectoCode, proyectoName, admin } = this.props;
    const username = Cookies.get("user");

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

    axios.get(API_URL_proyecto_con_causa, { headers:this.headers })
      .then(response => {
        const pccs = response.data;
        this.setState({ pccs });
      })
      .catch(error => {
        console.error('Error fetching clientes:', error);
      });
    
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
    //onsole.log('this.props.estudiantesIngreso',this.props.estudiantesIngreso)
    //console.log('this.state.adminCostPercentage ',this.state.adminCostPercentage )
    const subTotal = this.props.estudiantesIngreso * this.state.adminCostPercentage /100;
    this.setState((prevState) => ({
      ...prevState,
      subcantidad: subTotal,
      cantidad: subTotal,
        }), () => {
            //console.log('Updated state:', this.state);
        });
 
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };


  createAdmin = (e) => {
    e.preventDefault();
    this.getData()

    const random_string = this.generateRandomString(5);
    this.setState({ comision_multi_code: random_string }, () => {
        axios.post(API_URL_comision_multi, this.state, { headers: this.headers })
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
    try {
        // Wait for this.getData() to finish before proceeding
        await this.getData();
        await axios.put(API_URL_comision_multi + this.state.pk, this.state, { headers: this.headers });
        this.props.resetState();
        this.props.toggle();
    } catch (error) {
        console.log(error);
        this.setState({ errorMessage: 'Error updating Admin.' });
    }
  };

  render() {
    const { errorMessage, adminCostPercentage, moneda, pccs, instructor } = this.state;
    const { proyectoCode, proyectoName, estudiantesIngreso } = this.props;
    const h3Style = { color: 'blue' };

    return (
      <div>
        <h3>{proyectoName}</h3>
        {proyectoCode && <h3 style={h3Style}>{proyectoCode.toUpperCase()}</h3>}
        <h5>Ingreso del Proyecto: {estudiantesIngreso?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
        <Form onSubmit={this.props.admin ? this.editAdmin : this.createAdmin}>
          <FormGroup>
            <Label for="instructor">Proeycto con Causa</Label>
            <Input
              type="select"
              name="instructor"
              value={instructor}
              onChange={this.onChange}
            >
              <option value="">Donador:</option>
              {Array.isArray(pccs) && pccs.map(pcc => (
                <option key={pcc.pk} value={pcc.nombre}>
                  {pcc.nombre}
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
            <Label for="costo">Aportacion Poryecto con Causa:</Label>
            <h5>{(estudiantesIngreso * adminCostPercentage / 100)?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
          </FormGroup>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default ProyectoConCausaForm;

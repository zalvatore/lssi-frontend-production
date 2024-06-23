import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_movimientos, API_URL_proyectos, API_URL_partners } from "../../constants";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";



class MovimientoForm extends React.Component {

  state = {
    pk: 0,
    proyecto_code: "",
    proyecto: "",
    movimiento_txt: '',
    errorMessage: '',
    valueStream: '',
    boxScore: '',
    partners: [],
    miembro_comp:'',
  };

  componentDidMount() {
    if (this.props.movimiento) {
      const { 
      pk, 
      proyecto_code,
      proyecto,
      movimiento_txt,
      cuenta,
      fecha,
      referencia_alfa,
      referencia_numerica,
      autorizacion,
      movimiento,
      depositos,
      descripcion,
      retiros,
      saldo,
      valueStream,
      boxScore,
      partners,
      miembro_comp,

      } = this.props.movimiento;
      this.setState({ 
        pk, 
        proyecto_code,
        proyecto,
        cuenta,
        fecha,
        referencia_alfa,
        referencia_numerica,
        autorizacion,
        movimiento_txt,
        movimiento,
        depositos,
        descripcion,
        retiros,
        saldo,
        valueStream,
        boxScore,
        partners,
        miembro_comp
      });
    }

    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };

    axios.get(API_URL_proyectos, { headers })
      .then((response) => {
        // Assuming the response data is an array of proyectos with a 'status' property
        const proyectos = response.data.filter((proyecto) => proyecto.status !== 'Terminado');
        this.setState({ proyectos }, () => {
          // State has been updated with filtered proyectos
          console.log('Proyectos loaded and state updated:', this.state.proyectos);
        });
      })
      .catch((error) => {
        console.error("Error fetching Proyectos:", error);
      });

      axios.get(API_URL_partners, { headers })
      .then(res => this.setState({ partners: res.data }))
      .catch(error => console.log(error));
}

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleProyectoChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      const [name, code] = selectedValue.split('|');
      // Now you can use both `name` and `code`
      this.setState({
        proyecto: name,
        proyecto_code: code,
      });
    } else {
      // Handle the case where no proyecto is selected
      this.setState({
        proyecto: '',
        proyecto_code: '',
      }, () => {
        console.log('Updated state:', this.state);
      });
    }
  };

  createMovimiento = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_movimientos, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
      //console.log("this.state:", this.state)
    }).catch(error => {
      console.log(error);
      //console.log("this.state:", this.state)
      this.setState({ errorMessage:'Error al crear movimiento.' });
      });
  };

  editMovimiento = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_movimientos + this.state.pk, this.state, { headers }).then(() => {
      this.props.resetState();
      this.props.toggle();
      //console.log("this.state:", this.state)
    }).catch(error => {
      //console.log("this.state:", this.state)
      console.log(error);
      this.setState({ errorMessage:'Error updating movimiento.' });
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  handleFormTypeChange = (event) => {
    this.setState({ formType: event.target.value });
  };

  renderFormContent = () => {
    const { formType, proyectos, valueStream, boxScore, partners } = this.state;

    if (formType === "proyecto") {
      return (
        <div>
          <FormGroup>
            <Label for="proyecto">Selecciona Proyecto</Label>
              <Input
                type="select"
                name="proyecto"
                onChange={this.handleProyectoChange}
              >
                <option value="">Proyectos:</option>
                {Array.isArray(proyectos) &&
                  proyectos
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((proyecto) => (
                      <option key={proyecto.pk} value={`${proyecto.name}|${proyecto.proyecto_code}`}>
                        {proyecto.name}
                      </option>
                    ))}
              </Input>
          </FormGroup>

        </div>
      );
    } else if (formType === "movimiento") {
      return (
        <div>
          <FormGroup>
            <Label for="valueStream">Value Stream:</Label>
            <Input
              type="select"
              name="valueStream"
              value={valueStream}
              onChange={this.onChange}
              className="form-control"
            >
              <option value="">Selecciona Value Stream</option>
              <option value="eu">EU</option>
              <option value="general">General Services</option>
              <option value="latam">LATAM</option>
              <option value="online">Online</option>
              <option value="mexPartner">Mexico Partners</option>
              <option value="mexTraining">Mexico Training</option>
              <option value="mexProjects">Mexico Projects</option>
              <option value="matDev">Material Development</option>
              <option value="peru">Peru</option>
              <option value="products">Products</option>
              <option value="usaPartner">USA Partners</option>
              <option value="usaTraining">USA Training</option>
              <option value="usaProjects">USA Projects</option>

            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="boxScore">Rubro de Box Score:</Label>
            <Input
              type="select"
              name="boxScore"
              value={boxScore}
              onChange={this.onChange}
              className="form-control"
            >
              
              <option value="">Selecciona rubro Box Score</option>
              <option value="revenue">Revenue</option>
              <option value="other">Other Revenue</option>
              <option value="direct">Direct Cost + Partner Share</option>
              <option value="conversionVS">Value Stream Conversion Cost</option>
              <option value="investmentVS">Value Stream Investment</option>
              <option value="conversion">Conversion Cost General Services</option>
              <option value="investmentGS">Investment General Services</option>
              <option value="tax">Tax</option>

            </Input>
          </FormGroup>
          
        </div>
      );
    } else if (formType === "miembro_compartido") {
      return (
        <div>
          <FormGroup>
            <Label for="miembro_comp">Selecciona Miembro</Label>
              <Input
                type="select"
                name="miembro_comp"
                onChange={this.onChange}
              >
                <option value="">Miembro Compartido:</option>
                {partners
                  .slice() // Create a copy of the array to avoid modifying the original
                  .sort((a, b) => a.partner.localeCompare(b.partner)) // Sort partners alphabetically
                  .map((partner) => (
                    <option key={partner.pk} value={partner.partner}>
                      {partner.partner}
                    </option>
                  ))}
              </Input>
          </FormGroup>

        </div>
      );
    } else {
      return null; // or some default content
    }
  };


  render() {

    const {  
      errorMessage,} = this.state;


    return (
      <Form onSubmit={this.props.movimiento ? this.editMovimiento : this.createMovimiento}>
        <FormGroup>
          <Label for="formType">Elige una opción</Label>
          <Input type="select" name="formType" onChange={this.handleFormTypeChange}>
            <option value="">Selecciona...</option>
            <option value="proyecto">Selecciona Proyecto</option>
            <option value="movimiento">Movimiento de Box Score</option>
            <option value="miembro_compartido">Miembro Compartido</option>
          </Input>
        </FormGroup>

        {this.renderFormContent()}

        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Button>Enviar</Button>
      </Form>
    );
  }
}

export default MovimientoForm;
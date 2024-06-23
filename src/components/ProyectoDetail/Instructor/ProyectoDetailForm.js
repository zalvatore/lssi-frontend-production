import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_instructores } from "../../../constants";
import { API_URL_partners } from "../../../constants";
import emailjs from '@emailjs/browser';
import Cookies from 'js-cookie';

class ProyectoIngresoFrom extends React.Component {

  state = {
    pk: 0,
    errorMessage: "", // Initialize errorMessage in state
    instructor: "", // Add instructor property to the initial state
    proyecto_code: "",
    observaciones: "",
    totalIncome: "",
    totalCost: "",
    profitability: "",
    horas:"",
  };

  componentDidMount() {
    if (this.props.instructor) {
      const { 
      pk, 
      instructor,
      proyecto_code,
      miembro_que_asigna,
      horas,
      traifa_hora,
      costo_hora,
      moneda,
      semanas,
      observaciones,
      totalIncome,
      totalCost,
      profitability,
      } = this.props.instructor;
      this.setState({ 
        pk, 
        instructor,
        proyecto_code,
        miembro_que_asigna,
        horas,
        traifa_hora,
        costo_hora,
        moneda,
        semanas,
        observaciones,
        totalIncome,
        totalCost,
        profitability,
      }, () => {

      this.calculateTotal();
      this.calculateTotalCost();
      this.calculateProfitability();
      
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
        console.error('Error fetching partners:', error);
      });

      const proyectoCodeFrom = this.props.proyectoCode;
      this.setState({ proyecto_code: proyectoCodeFrom }); 
  }

  onChange = e => {
    this.setState({ 
      [e.target.name]: e.target.value 
    }, () => {
      this.calculateTotal();
      this.calculateTotalCost();
      this.calculateProfitability();
    });
  };


  sendEmail = (e) => {
    e.preventDefault();
    //console.log('this.state',this.state);
    //console.log('this.props.proyectoName',this.props.proyectoName);

    const { 
      instructor, 
      horas, 
      costo_hora, 
      moneda, 
      semanas, 
      observaciones 
    } = this.state;
    const proyectoNameFrom = this.props.proyectoName;

    //console.log('instructor',instructor);

    const emailParams = {
      to_email: 'bgonzalez@leansixsigmainstitute.org', 
      //to_email: 'lsocconini@leansixsigmainstitute.org', 
      //to_email: 'admin_eu@lssinstitute.org',
      from_name: 'Salvador Sanchez',
      to_name: 'Bernardo',
      reply_to: 'bgonzalez@leansixsigmainstitute.org',
      instructor: instructor,
      horas: horas,
      costo_hora: costo_hora,
      moneda: moneda,
      semanas: semanas,
      observaciones: observaciones,
      proyectoNameFrom: proyectoNameFrom,

    };

    emailjs.send('service_vzlc6dt', 'template_he5jinj', emailParams, 'VBYWnQsgbxRBcGQ8N')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  createPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_instructores, this.state, { headers })
      .then(() => {
      //this.sendEmail(e);
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
        this.setState({ errorMessage:'Error adding partida.' });
        console.error("Error adding consultant:", error);
    });
  };

  editPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_instructores + this.state.pk, this.state, { headers })
    .then(() => {
      this.props.resetState();
      this.props.toggle();
      console.log("this.state", this.state);
    }).catch(error => {
      console.log(error);
      this.setState({ errorMessage:'Error updating partida.' });
      console.log("this.state", this.state);
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  handleWheel = (e) => {
    // Prevent mouse wheel events from affecting the input field
    e.preventDefault();
  };

  calculateTotal = () => {
    const { horas, traifa_hora, semanas } = this.state;

    if (!isNaN(horas) && !isNaN(traifa_hora) && !isNaN(semanas)) {
      const totalIncome = horas * traifa_hora * semanas;
      this.setState({ totalIncome });
    } else {
      this.setState({ totalIncome: "" });
    }
  };

  calculateTotalCost = () => {
    const { horas, costo_hora, semanas } = this.state;

    if (!isNaN(horas) && !isNaN(costo_hora) && !isNaN(semanas)) {
      const totalCost = horas * costo_hora * semanas;
      this.setState({ totalCost });
    } else {
      this.setState({ totalCost: "" });
    }
  };

  calculateProfitability = () => {
    const { totalIncome, horas, costo_hora, semanas } = this.state;
    const totalCost = horas * costo_hora * semanas;
  
    if (!isNaN(totalIncome) && !isNaN(totalCost)) {
      const profitability = (totalIncome - totalCost)/totalIncome;
      this.setState({ profitability }, () => {
      });
    } else {
      this.setState({ profitability: "" });
    }
  };

  render() {
    const { errorMessage, instructor, partners,miembro_que_asigna} = this.state;
    const proyectoCodeFrom = this.props.proyectoCode
    const proyectoNameFrom = this.props.proyectoName
    const h3Style = {
        color: 'blue' // Change the color to your desired value
      };
  
    return (
        <div>
            <h3>{proyectoNameFrom}</h3>
            {proyectoCodeFrom && 
            <h3 style={h3Style}>{proyectoCodeFrom.toUpperCase()}</h3>
            }
        <Form onSubmit={this.props.instructor ? this.editPartida : this.createPartida}>
          <FormGroup>
          <Label for="instructor">Instructor:</Label>
          <Input
              type="select"
              name="instructor"
              value={instructor}
              onChange={this.onChange}
          >
              <option key='0' value="">Instructor:</option>
              {Array.isArray(partners) && 
                  partners.sort((a, b) => a.partner.localeCompare(b.partner)).map(partner => (
                      <option key={partner.pk} value={partner.partner}>
                          {partner.partner}
                      </option>
                  ))
              }
                </Input>
            </FormGroup>

            <FormGroup>
              <Label for="miembro_que_asigna">Partner que provee instructor:</Label>
              <Input
                type="select"
                name="miembro_que_asigna"
                value={miembro_que_asigna}
                onChange={this.onChange}
              >
                <option key='0' value="">Miembro que asigna:</option>
                {Array.isArray(partners) && partners.map(partner => (
                  <option key={partner.pk} value={partner.partner}>
                    {partner.partner}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="horas">Horas x Semana:</Label>
                <Input
                    type="number"
                    name="horas"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.horas)}
                    placeholder="Horas"
                    className="form-control"
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                />
            </FormGroup>
            <FormGroup>
            <Label for="traifa_hora">Precio x Hora:</Label>
            <Input
                type="number"
                name="traifa_hora"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.traifa_hora)}
                placeholder="Ingresa precio x hora"
                className="form-control"
                inputMode="numeric"
                onWheel={(e) => e.target.blur()}
            />
            </FormGroup>
            <FormGroup>
              <Label for="semanas">Numero de Semanas:</Label>
                <Input
                  type="number"
                  name="semanas"
                  onChange={this.onChange}
                  value={this.defaultIfEmpty(this.state.semanas)}
                  placeholder="Semanas"
                  className="form-control"
                  inputMode="numeric"
                  onWheel={(e) => e.target.blur()}
              />
            </FormGroup>
            <FormGroup>
              <Label for="totalIncome">Total Ingreso:</Label>
              <Input
                type="text"
                name="totalIncome"
                value={this.state.totalIncome?.toLocaleString()}
                disabled 
              />
            </FormGroup>
            <FormGroup>
              <Label for="costo_hora">Costo x Hora:</Label>
                <Input
                    type="number"
                    name="costo_hora"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.costo_hora)}
                    placeholder="Ingresa costo x hora"
                    className="form-control"
                    inputMode="numeric"
                    onWheel={(e) => e.target.blur()}
                  />
              </FormGroup>
              <FormGroup>
              <Label for="totalCost">Total Costo:</Label>
              <Input
                type="text"
                name="totalCost"
                value={this.state.totalCost?.toLocaleString()}
                disabled 
              />
            </FormGroup>
            <FormGroup>
              <Label for="profitability">Margen:</Label>
              <Input
                type="text"
                name="profitability"
                value={`${(this.state.profitability * 100).toFixed(2)}%`}
                disabled 
              />
            </FormGroup>
              <FormGroup>
                <Label for="moneda">Moneda:</Label>
                <Input
                  type="select"
                  name="moneda"
                  value={this.defaultIfEmpty(this.state.moneda)}
                  onChange={this.onChange}
                  className="form-control"
                >
                  <option key='0' value="">Selecciona moneda</option>
                  <option key='1' value="MXN">MXN</option>
                  <option key='2' value="USD">USD</option>
                  <option key='3' value="EUR">EUR</option>
                </Input>
            </FormGroup>

            <FormGroup>
              <Label for="observaciones">Observaciones:</Label>
              <Input
                type="text"
                name="observaciones"
                onChange={this.onChange}
                value={this.defaultIfEmpty(this.state.referencia)}
              />
            </FormGroup>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <Button>Guardar</Button>
        </Form>
      </div>
    );
  }
}

export default ProyectoIngresoFrom;
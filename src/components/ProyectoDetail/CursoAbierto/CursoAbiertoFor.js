import React from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";
import { API_URL_partidas_curso_abierto, API_URL_partners} from "../../../constants";
import Cookies from 'js-cookie';

class CursoAbiertoFor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pk: '',
      nombre: '',
      estudiante: '',
      telefono: '',
      correo: '',
      precio: '',
      referencia: '',
      moneda: '',
      proyecto_code: '',
      miembro_vendedor:'',
      partner_vendedor:'',
      comision_vendedor:'',
    };
  }

  componentDidMount() {
    if (this.props.estudiante) {
      const { 
        pk,
        estudiante,
        nombre,
        telefono,
        correo,
        precio,
        referencia,
        moneda,
        proyecto_code,
        miembro_vendedor,
        partner_vendedor,
        comision_vendedor,
      } = this.props.estudiante
      this.setState({ 
        pk,
        estudiante,
        nombre,
        telefono,
        correo,
        precio,
        moneda,
        referencia,
        proyecto_code,
        miembro_vendedor,
        partner_vendedor,
        comision_vendedor,
      });

      
    }
      this.getpartners();
      const proyectoCodeFrom = this.props.proyectoCode;
      this.setState({ proyecto_code: proyectoCodeFrom }); 
    
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.post(API_URL_partidas_curso_abierto, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
        this.setState({ errorMessage:'Error adding estudiante.' });
        console.error("Error adding estudiante:", error);
    });
  };

  editPartida = e => {
    e.preventDefault();
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    axios.put(API_URL_partidas_curso_abierto + this.state.pk, this.state, { headers })
      .then(() => {
      this.props.resetState();
      this.props.toggle();
    }).catch(error => {
      this.setState({ errorMessage:'Error editing estudiante.' });
      console.error("Error editing estudiante:", error);
      //console.log("this.state", this.state);
      });
  };

  defaultIfEmpty = value => {
    return value === "" ? "" : value;
  };

  getpartners = () => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.get(API_URL_partners, { headers })
        .then(res => {
            // Sort partners alphabetically by partner name
            const sortedPartners = res.data.sort((a, b) => {
                if (a.partner < b.partner) return -1;
                if (a.partner > b.partner) return 1;
                return 0;
            });

            // Set the sorted partners in the state
            this.setState({ partners: sortedPartners });
        })
        .catch(error => console.log(error));
};


  resetState = () => {
    this.getpartners();
  };

  render() {
    const {
      errorMessage, 
      miembro_vendedor, 
      partner_vendedor, 
      partners,
      comision_vendedor, 
    } = this.state;
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
        <Form onSubmit={this.props.estudiante ? this.editPartida : this.createPartida}>
            <FormGroup>
              <Label for="nombre">Nombre de estudiante:</Label>
                <Input
                    type="text"
                    name="nombre"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.nombre)}
                />
            </FormGroup>
            <FormGroup>
              <Label for="Selecciona partner de vendedor">Selecciona Partner de Vendedor:</Label>
              <Input
                type="select"
                name="partner_vendedor"
                value={partner_vendedor}
                onChange={this.onChange}
                >
                  <option key='0' value="">Partner:</option>
                  {Array.isArray(partners) && partners
                  .map(partner => (
                    <option key={partner.pk} value={partner.partner}>
                      {partner.partner}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="Selecciona miembro vendedor">Selecciona Miembro Vendedor:</Label>
              <Input
                type="select"
                name="miembro_vendedor"
                value={miembro_vendedor}
                onChange={this.onChange}
                >
                  <option key='0' value="">Miembro:</option>
                  {Array.isArray(partners) && partners
                  .map(partner => (
                    <option key={partner.pk} value={partner.partner}>
                      {partner.partner}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="Selecciona % de comision vendedor">Selecciona % de comision del Vendedor:</Label>
              <Input
                type="numeric"
                name="comision_vendedor"
                value={comision_vendedor}
                onChange={this.onChange}
                >
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="correo">Correo:</Label>
                <Input
                    type="email"
                    name="correo"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.correo)}
                />
            </FormGroup>
            <FormGroup>
              <Label for="telefono">Telefono:</Label>
                <Input
                    type="numeric"
                    name="telefono"
                    onChange={this.onChange}
                    value={this.defaultIfEmpty(this.state.telefono)}
                />
            </FormGroup>
            <FormGroup>
            <Label for="precio">Precio x estudiante:</Label>
              <Input
                  type="number"
                  name="precio"
                  onChange={this.onChange}
                  value={this.defaultIfEmpty(this.state.precio)}
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
                  <option value="">Selecciona moneda</option>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="COP">COP</option>
                </Input>
            </FormGroup>
            <FormGroup>
              <Label for="referencia">Referencia:</Label>
              <Input
                type="text"
                name="referencia"
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

export default CursoAbiertoFor;
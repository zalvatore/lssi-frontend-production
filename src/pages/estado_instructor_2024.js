import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Table, Input  } from "reactstrap";
import Switch from "react-switch";
import "./styles.css"; 

import { 
  getProyectos,
  getInstructores,
  getPartidas,
  getUtilidades,
} from "../api-services";
import {  
  API_URL_partners,
  API_URL_instructores,
  API_URL_partidas,
} from "../constants";

class EstadoInstructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      proyectos: [],
      partners: [],
      proyectosWithInstructores:[],
      filteredInstructoresWithProyecto:[],
      checked: false,
      toggleStates: {}, 
      toggleStatesPartida: {},
      selectedProyectos: [],
      partnerData: [],
      partnersIVA: [],
      selectedProyectosText: '',
      horas_de_semana_proyecto: {}, // Add this state variable
      costo_proyecto:{},
      costo_utilidad:{},
      validationErrors: {}, 
      validationErrorsCostos:{},
      validationErrorsUtilidades:{},
      validationErrors_horas:{},
      value_honorarios_semanas:{},
      value_honorarios_horas:{},
      
    };

  }

  componentDidMount() {
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    const fetchPartners = () => {
        return axios.get(API_URL_partners, { headers })
            .then(res => res.data)
            .catch(error => console.log("Error fetching partners:", error));
    };

    const fetchInstructorsAndPartners = () => {
        return axios.get(API_URL_instructores, { headers })
            .then(instructorsResponse => {
                const instructors = instructorsResponse.data;
                this.setState({ instructors });

                return fetchPartners().then(partners => {
                    const filteredPartners = partners.filter(partner =>
                        instructors.some(instructor => partner.partner === instructor.instructor)
                    );
                    this.setState({ partners: filteredPartners });
                });
            })
            .catch(error => console.log("Error fetching instructors:", error));
    };

    const fetchProyectosAndData = (getDataFunction, stateKey) => {
        return Promise.all([getProyectos(headers), getDataFunction(headers)])
            .then(([proyectos, data]) => {
                const proyectosMap = new Map();
                proyectos.forEach(proyecto => proyectosMap.set(proyecto.proyecto_code, proyecto));

                const dataWithProyectos = data.map(item => ({
                    ...item,
                    proyecto: proyectosMap.get(item.proyecto_code)
                }));

                const filteredDataWithProyectos = dataWithProyectos.filter(item => item.proyecto !== undefined);
                this.setState({ [stateKey]: filteredDataWithProyectos });
            })
            .catch(error => console.log("Error fetching data:", error));
    };

    Promise.all([
        axios.get(API_URL_partidas, { headers }).then(res => res.data),
        getInstructores(headers),
        getProyectos(headers)
    ])
    .then(([partidas, instructores, proyectos]) => {
        this.setState({ partidas, instructores });

        const instructoresWithProyectos = instructores.map(instructor => ({
            ...instructor,
            proyecto: proyectos.find(proyecto => proyecto.proyecto_code === instructor.proyecto_code)
        })).filter(instructor => instructor.proyecto !== undefined);

        this.setState({ instructoresWithProyectos });
    })
    .catch(error => console.log("Error fetching data:", error));

    fetchInstructorsAndPartners();
    fetchProyectosAndData(getPartidas, 'partidasWithProyectos');
    fetchProyectosAndData(getUtilidades, 'utilidadWithProyectos');
}

generateRandomString = (length) => {
  const characters = 'abcdefghjklmnpqrstuvwxyz23456789';
  const charactersLength = characters.length;
  let random_string = '';
  
  for (let counter = 0; counter < length; counter++) {
    random_string += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return random_string;
};

handleChange = e => {
  this.setState({ [e.target.name]: e.target.value });
};

handleToggle = (rowKey, stateKey) => {
  this.setState(prevState => {
      const toggleStates = { ...prevState[stateKey] };
      toggleStates[rowKey] = !toggleStates[rowKey];
      return { [stateKey]: toggleStates };
  });
};

handleToggleType = (rowKey, stateKey, initialState = false) => {
  this.setState(prevState => {
      const toggleStates = { ...prevState[stateKey] };
      toggleStates[rowKey] = !toggleStates[rowKey];
      return { [stateKey]: toggleStates };
  });
};

hasActiveValidationErrors = () => {
  const { validationErrors, validationErrorsCostos, validationErrorsUtilidades } = this.state;
  const hasErrors = Object.values(validationErrors).some(error => error !== null);
  const hasCostosErrors = Object.values(validationErrorsCostos).some(error => error !== null);
  const hasUtilidadErrors = Object.values(validationErrorsUtilidades).some(error => error !== null);
  return hasErrors || hasCostosErrors || hasUtilidadErrors;
};

handleMiembroChange = event => {
  const selectedPartner = event.target.value;
  const { instructoresWithProyectos, utilidadWithProyectos, partnersIVA, partidasWithProyectos } = this.state;

  // Log the initial state of partidasWithProyectos
  console.log("Initial partidasWithProyectos:", partidasWithProyectos);
  console.log("selectedPartner:", selectedPartner);

  const filteredInstructoresWithProyectos = instructoresWithProyectos.filter(data => data.instructor === selectedPartner);
  const filteredPartidasWithProyectos = partidasWithProyectos.filter(data => data.miembro_asignado === selectedPartner);
  const filteredUtilidadesWithProyectos = utilidadWithProyectos.filter(data => data.partner === selectedPartner);

  // Log the filtered data
  console.log("Filtered partidasWithProyectos:", filteredPartidasWithProyectos);

  const toggleStates = {};
  const toggleStatesPartida = {};
  const toggleStatesPartidaIVA = {};
  const toggleStatesPartidaRetencion = {};
  const toggleStatesPartidaISR = {};
  const toggleStatesUtilidad = {};

  filteredInstructoresWithProyectos.forEach(proyecto => {
      toggleStates[proyecto.pk] = true;
  });

  filteredPartidasWithProyectos.forEach(data => {
      toggleStatesPartida[data.pk] = true;
      toggleStatesPartidaIVA[data.pk] = false;
      toggleStatesPartidaRetencion[data.pk] = false;
      toggleStatesPartidaISR[data.pk] = false;
  });

  filteredUtilidadesWithProyectos.forEach(data => {
      toggleStatesUtilidad[data.pk] = true;
  });

  const partnerData = partnersIVA.filter(data => data.partner === selectedPartner);

  this.setState({ 
      filteredInstructoresWithProyectos,
      filteredPartidasWithProyectos,
      filteredUtilidadesWithProyectos,
      toggleStates,
      toggleStatesPartida,
      toggleStatesPartidaIVA,
      toggleStatesPartidaRetencion,
      toggleStatesPartidaISR,
      toggleStatesUtilidad,
      partnerData,
      selectedPartner,
      selectedProyectosText: '',
  });
};



  

  onChangeSemanas = (e, pk, horas) => {
    const inputValue = e.target.value || '1'; // default to '1'
    const max = e.target.max || '1';
  
    const inputValueFloat = parseFloat(inputValue);
    const maxFloat = parseFloat(max);
  
    if (isNaN(inputValueFloat) || isNaN(maxFloat)) {
      console.error('Invalid input or max value.'); 
      return;
    }

    const updatedHoras = inputValueFloat * horas;
    this.setState((prevState) => ({
      validationErrors: {
        ...prevState.validationErrors,
        [pk]: inputValueFloat <= maxFloat ? null : `Valor supera semanas permitido: (${maxFloat.toLocaleString()})`,
      },
      horas_de_semana_proyecto: {
        ...prevState.horas_de_semana_proyecto,
        [pk]: inputValueFloat,
      },
      value_honorarios_horas: {
        ...prevState.value_honorarios_horas,
        [pk]: inputValueFloat <= maxFloat ? updatedHoras : prevState.value_honorarios_horas[pk], // Keep the previous value if inputValue is greater than max
      },
    }));
  };
  


  onChangeHoras = (e, pk, hora) => {
    const inputValue = e.target.value || 1; // default to 1
    const max = e.target.max || '1';

    const inputValueFloat = parseFloat(inputValue);
    const maxFloat = parseFloat(max);

    if (isNaN(inputValueFloat) || isNaN(maxFloat)) {
      console.error('Invalid input or max value.'); // Handle invalid input values
      return;
    }

    const updated_semanas = inputValue / hora;

  
    this.setState((prevState) => ({
      validationErrors_horas: {
        ...prevState.validationErrors_horas,
        [pk]: inputValueFloat <= maxFloat ? null : `Valor supera horas permitido: (${maxFloat.toLocaleString()})`,
      },
      value_honorarios_horas: {
        ...prevState.value_honorarios_horas,
        [pk]: inputValue,
      },
      horas_de_semana_proyecto: {
        ...prevState.horas_de_semana_proyecto,
        [pk]: inputValueFloat <= maxFloat ? updated_semanas: prevState.horas_de_semana_proyecto[pk],
      },
    }), () => {
      console.log('State End Horas Change ->', this.state);
    });
  }
  



  onChangeCostos = (e, pk) => {
    const inputValue = e.target.value || 1; // Convert to integer or default to 1
    const max = e.target.max;

    const inputValueFloat = parseFloat(inputValue);
    const maxFloat = parseFloat(max);

    this.setState((prevState) => ({
      validationErrorsCostos: {
        ...prevState.validationErrorsCostos,
        [pk]: inputValueFloat <= maxFloat ? null : `Valor supera costo permitido: (${maxFloat.toLocaleString()})`,
      },

      costo_proyecto: {
        ...prevState.costo_proyecto,
        [pk]: inputValueFloat <= maxFloat ? inputValueFloat : prevState.costo_proyecto[pk], // Keep the previous value if inputValue is greater than max
      },
    }));

  };

  onChangeUtilidad = (e, pk) => {
    const inputValue = e.target.value || 1; // Convert to integer or default to 1
    const max = e.target.max;

    const inputValueFloat = parseFloat(inputValue);
    const maxFloat = parseFloat(max);

    this.setState((prevState) => ({
      validationErrorsUtilidades: {
        ...prevState.validationErrorsUtilidades,
        [pk]: inputValueFloat <= maxFloat ? null : `Valor supera utilidad permitido: (${maxFloat.toLocaleString()})`,
      },

      costo_utilidad: {
        ...prevState.costo_utilidad,
        [pk]: inputValueFloat <= maxFloat ? inputValueFloat : prevState.costo_utilidad[pk], // Keep the previous value if inputValue is greater than max
      },
    }));

  };
  
  generateHexCode = () => {
    const excludedChars = ['o', '0', '1', 'I'];
    let randomHexCode = '';
    
    while (randomHexCode.length < 5) {
      const randomChar = Math.floor(Math.random() * 0xF).toString(16).toUpperCase();
      if (!excludedChars.includes(randomChar)) {
        randomHexCode += randomChar;
      }
    }
    return randomHexCode;
  };
  
 
  
  render() {
    const { 
      projects,
      partners,
      miembroName,
      filteredInstructoresWithProyectos,
      filteredPartidasWithProyectos,
      filteredUtilidadesWithProyectos,
      costo_proyecto,
      costo_utilidad,
      partnerData,
     } = this.state;

     // Calculate the sum of "Total de Proyecto"
    let totalSum = 0;
    //console.log("random_string_4", this.state.random_string);
    if (filteredInstructoresWithProyectos && filteredInstructoresWithProyectos.length > 0) {
        totalSum = filteredInstructoresWithProyectos.reduce((sum, proyecto) => {
        const projectTotal =
            proyecto.costo_hora * proyecto.horas * proyecto.semanas;
        return sum + projectTotal;
        }, 0);
    }

    let totalSumPartida = 0;
    //console.log("random_string_4", this.state.random_string);
    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
      totalSumPartida = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
        const projectTotal =
            proyecto.costo;
        return sum + projectTotal;
        }, 0);
    }

    let totalSumUtilidad = 0;
    //console.log("random_string_4", this.state.random_string);
    if (filteredUtilidadesWithProyectos && filteredUtilidadesWithProyectos.length > 0) {
      totalSumUtilidad = filteredUtilidadesWithProyectos.reduce((sum, proyecto) => {
        const projectTotal =
            proyecto.cantidad;
        return sum + projectTotal;
        }, 0);
    }

    let totalSumSemana = 0;
    //console.log("random_string_5", this.state.random_string);
    if (filteredInstructoresWithProyectos && filteredInstructoresWithProyectos.length > 0) {
      totalSumSemana = filteredInstructoresWithProyectos.reduce((sum, proyecto) => {
        if (this.state.toggleStates[proyecto.pk]) {
          const projectTotal = 
              proyecto.costo_hora * proyecto.horas * (this.state.horas_de_semana_proyecto[proyecto.pk] || 1);
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }

    let totalSumSemanaPartida = 0;
    //console.log("random_string_5", this.state.random_string);
    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
      totalSumSemanaPartida = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
        if (this.state.toggleStatesPartida[proyecto.pk]) {
          const projectTotal = 
              (costo_proyecto[proyecto.pk] || 1);
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }


    let totalSumSemanaPartidasIVA = 0;

    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
        totalSumSemanaPartidasIVA = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
          const toggleStatePartidaIVA = this.state.toggleStatesPartidaIVA[proyecto.pk];
    if (
      this.state.toggleStatesPartida[proyecto.pk] &&
      toggleStatePartidaIVA // Check if toggleStatePartidaIVA is not true
    ) {
      const projectTotal = costo_proyecto[proyecto.pk] || 1;
      //console.log("projectTotal:", projectTotal); // Log projectTotal
      return sum + projectTotal;
    }
    return sum;
  }, 0);
}

    let totalSumSemanaPartidasISR = 0;

    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
      totalSumSemanaPartidasISR = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
        if (
          this.state.toggleStatesPartida[proyecto.pk] &&
          this.state.toggleStatesPartidaISR[proyecto.pk] // Check if proyecto.partida.partida is defined
        ) {
          const projectTotal = costo_proyecto[proyecto.pk] || 1;
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }

    let totalSumSemanaPartidasRetencion = 0;

    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
      totalSumSemanaPartidasRetencion = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
        if (
          this.state.toggleStatesPartida[proyecto.pk] &&
          this.state.toggleStatesPartidaRetencion[proyecto.pk] // Check if proyecto.partida.partida is defined
        ) {
          const projectTotal = costo_proyecto[proyecto.pk] || 1;
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }




    let totalSumSemanaUtilidad = 0;
    //console.log("random_string_5", this.state.random_string);
    if (filteredUtilidadesWithProyectos && filteredUtilidadesWithProyectos.length > 0) {
      totalSumSemanaUtilidad = filteredUtilidadesWithProyectos.reduce((sum, proyecto) => {
        if (this.state.toggleStatesUtilidad[proyecto.pk]) {
          const projectTotal = 
              (costo_utilidad[proyecto.pk] || 1);
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }

    let IVAdelInstructor = 0.0;
    let retenciondelInstructor = 0.0;
    let ISRdelInstructor = 0.0;
    let total_despues_impuestos = 0
    let totalSemana = totalSumSemana + totalSumSemanaPartida + totalSumSemanaUtilidad;
    //let totalSemanaSinRetencion = totalSumSemana + totalSumSemanaPartidaNoViaticos + totalSumSemanaUtilidad;
    let totalSemanaIVA = totalSumSemana + totalSumSemanaPartidasIVA + totalSumSemanaUtilidad;
    let totalSemanaISR = totalSumSemana + totalSumSemanaPartidasISR + totalSumSemanaUtilidad;
    let totalSemanaRetencion = totalSumSemana + totalSumSemanaPartidasRetencion + totalSumSemanaUtilidad;
    if (partnerData && partnerData.length > 0) {
      //IVAdelInstructor = (partnerData[0].iva / 100) * totalSumSemana;
      IVAdelInstructor = partnerData[0].iva / 100 * (totalSemanaIVA)
      //retenciondelInstructor = partnerData[0].retencion / 100 * totalSumSemana - se tiene que actualizar
      //retenciondelInstructor =  partnerData[0].iva / 3 * 2 / 100 * totalSumSemana 
      retenciondelInstructor =  partnerData[0].iva / 3 * 2 / 100 * (totalSemanaRetencion)
      ISRdelInstructor = partnerData[0].isr / 100 * (totalSemanaISR)
      total_despues_impuestos = totalSemana + IVAdelInstructor - retenciondelInstructor - ISRdelInstructor

    }

    return (
      <div>
        <h1>Estado de Cuenta</h1>
        <hr />
        <br/>
        <div>
          <div>
  
          <label>
            Miembro del equipo:
            <select
                value={miembroName}
                onChange={this.handleMiembroChange}
              >
                <option key='0' value="">Seleccionar Miembro</option>
                {partners
                  .slice() // Create a copy of the array to avoid modifying the original
                  .sort((a, b) => a.partner.localeCompare(b.partner)) // Sort partners alphabetically
                  .map((partner) => (
                    <option key={partner.pk} value={partner.partner}>
                      {partner.partner}
                    </option>
                  ))}
              </select>
            
          </label>
          </div>
          <br/>
          <div className="sticky-section">
            <h2>
                Saldo pendiente: {(totalSum + totalSumPartida +totalSumUtilidad).toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <h3>
                Total a cobrar esta semana antes de impuestos: {(totalSemana).toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <h5>
                IVA: {IVAdelInstructor.toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h5>
            <h5>
                Retencion IVA: {retenciondelInstructor.toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h5>
            <h5>
                Retencion ISR/IRPF: {ISRdelInstructor.toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h5>
            <h3>
            Total a cobrar esta semana despues de impuestos: {total_despues_impuestos
            .toLocaleString('en-US',
             { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <hr />
          <h3>Honorarios</h3>
          <div>

            <Table striped bordered responsive hover> 
                <thead>
                    <tr>
                    <th>Se Cobra?</th>
                    <th>Semanas a Cobrar</th>
                    <th>Horas a Cobrar</th>  
                    <th>Monto a Cobrar</th> 
                    <th>Codigo</th>
                    <th>Proyecto</th>
                    <th>Cliente</th>
                    <th>Modalidad</th>
                    <th>Moneda</th>
                    <th>$ x Hora</th>
                    <th>Horas</th>
                    <th>Semanas</th>
                    <th>Total de Proyecto</th> 
                    <th>Balance Pendiente</th> 
                    
                    </tr>
                </thead>
                <tbody>
                    {!filteredInstructoresWithProyectos || filteredInstructoresWithProyectos.length <= 0 ? (
                    <tr>
                        <td colSpan="15" align="center">
                        <b>Ups, todavia no hay proyectos!!</b>
                        </td>
                    </tr>
                    ) : (
                        filteredInstructoresWithProyectos.map(proyecto => (
                        <tr key={proyecto.pk}>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(proyecto.pk, 'toggleStates')}
                                checked={this.state.toggleStates[proyecto.pk] || false}
                            />
                            </td>


                            <td>
                              < Input
                                type="number"
                                min="1"
                                max={proyecto.semanas}
                                step="1"
                                defaultValue="1"
                                onChange={(e) => this.onChangeSemanas(e, proyecto.pk, proyecto.horas)}
                                onWheel={(e) => e.target.blur()}
                                value={this.state.horas_de_semana_proyecto[proyecto.pk]} 
                              />
                              {this.state.validationErrors[proyecto.pk] && (
                                <div className="text-danger">{this.state.validationErrors[proyecto.pk]}</div>
                              )}
                            </td>
                            <td>
                              < Input
                                type="number"
                                min="1"
                                max={proyecto.semanas * proyecto.horas}
                                step="1"
                                defaultValue={proyecto.horas}
                                onChange={(e) => this.onChangeHoras(e, proyecto.pk, proyecto.horas)}
                                onWheel={(e) => e.target.blur()}
                                value={this.state.value_honorarios_horas[proyecto.pk]} 
                              />
                              {this.state.validationErrors_horas[proyecto.pk] && (
                                <div className="text-danger">{this.state.validationErrors_horas[proyecto.pk]}</div>
                              )}
                            </td>
                            
                            <td>
                            {(
                                proyecto.costo_hora *
                                proyecto.horas *
                                (this.state.horas_de_semana_proyecto[proyecto.pk] || 1)
                            ).toLocaleString()}
                            </td>
                            <td>{proyecto.proyecto_code.toUpperCase()}</td>
                            <td>{proyecto.proyecto.name}</td>
                            <td>{proyecto.proyecto.cliente}</td>
                            <td>{proyecto.proyecto.modalidad}</td>
                            <td>{proyecto.moneda}</td>
                            <td>{proyecto.costo_hora}</td>
                            <td>{proyecto.horas}</td>
                            <td>{proyecto.semanas}</td>
                            
                            <td>0</td>
                            <td>
                            {(
                                proyecto.costo_hora *
                                proyecto.horas
                            ).toLocaleString()}
                            </td>
                        </tr>
                    )))}
                </tbody>
            </Table>
          </div>

        <hr />
        <h3>Gastos</h3>
          <div>
            < Table striped bordered responsive hover>
              <thead>
                <tr>
                <th>Se Cobra?</th>
                <th>IVA?</th>
                <th>Retencion?</th>
                <th>ISR/IRPF?</th>
                <th>Monto a Cobrar</th> 
                <th>Partida</th> 
                <th>Proyecto</th> 
                <th>Costo Total</th>
                <th>Moneda</th>
                <th>Referencia</th>
                <th>Producto</th>
                </tr>
              </thead>
              <tbody>
              {!filteredPartidasWithProyectos || filteredPartidasWithProyectos.length <= 0 ? (
                    <tr>
                        <td colSpan="15" align="center">
                        <b>Ups, todavia no hay Partidas!!</b>
                        </td>
                    </tr>
                    ) : (
                      filteredPartidasWithProyectos.map(partida => (
                        <tr key={partida.pk}>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(partida.pk, 'toggleStatesPartida')}
                                checked={this.state.toggleStatesPartida[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(partida.pk, 'toggleStatesPartidaIVA')}
                                checked={this.state.toggleStatesPartidaIVA[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(partida.pk, 'toggleStatesPartidaRetencion')}
                                checked={this.state.toggleStatesPartidaRetencion[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(partida.pk, 'toggleStatesPartidaISR')}
                                checked={this.state.toggleStatesPartidaISR[partida.pk] || false}
                            />
                            </td>
                            <td>
                              < Input
                                type="number"
                                min="1"
                                max={partida.costo}
                                step="1"
                                defaultValue="1"
                                onChange={(e) => this.onChangeCostos(e, partida.pk)}
                                onWheel={(e) => e.target.blur()}
                              />
                              {this.state.validationErrorsCostos[partida.pk] && (
                                <div className="text-danger">{this.state.validationErrorsCostos[partida.pk]}</div>
                              )}
                            </td>
                            <td>{partida.partida}</td>
                            <td>{partida.proyecto.name}</td>
                            <td>{partida.costo.toLocaleString()}</td>
                            <td>{partida.moneda}</td>
                            <td>{partida.referencia}</td>
                            <td>{partida.producto}</td>
                        </tr>
                    )))}

              </tbody>
            </Table>
          </div>
         <hr />
         <h3>Utilidades</h3>
          <div>
            < Table striped bordered responsive hover>
              <thead>
                <tr>
                <th>Se Cobra?</th>
                <th>Monto a Cobrar</th> 
                <th>Tipo Utilidad</th> 
                <th>Proyecto</th> 
                <th>Utilidad Total</th>
                <th>Moneda</th>
                </tr>
              </thead>
              <tbody>
              {!filteredUtilidadesWithProyectos || filteredUtilidadesWithProyectos.length <= 0 ? (
                    <tr>
                        <td colSpan="15" align="center">
                        <b>Ups, todavia no hay Utilidades!!</b>
                        </td>
                    </tr>
                    ) : (
                      filteredUtilidadesWithProyectos.map(utilidad => (
                        <tr key={utilidad.pk}>
                            <td>
                            <Switch
                                onChange={() => this.handleToggle(utilidad.pk, 'toggleStatesUtilidad')}
                                checked={this.state.toggleStatesUtilidad[utilidad.pk] || false}
                            />
                            </td>
                            <td>
                              < Input
                                type="number"
                                min="1"
                                max={utilidad.cantidad}
                                step="1"
                                defaultValue="1"
                                onChange={(e) => this.onChangeUtilidad(e, utilidad.pk)}
                                onWheel={(e) => e.target.blur()}
                              />
                              {this.state.validationErrorsUtilidades[utilidad.pk] && (
                                <div className="text-danger">{this.state.validationErrorsUtilidades[utilidad.pk]}</div>
                              )}
                            </td>
                            <td>{utilidad.tipo_utilidad}</td>
                            <td>{utilidad.proyecto.name}</td>
                            <td>{utilidad.cantidad.toLocaleString()}</td>
                            <td>{utilidad.proyecto.moneda}</td>
                        </tr>
                    )))}

              </tbody>
            </Table>
          </div>
        <hr />

        <br/>      
        <h3>Proyectos Agregados:</h3>
          {projects.map((project, index) => (
            <div key={index}>
              <p>{project.name}: ${project.amount.toLocaleString()}</p>
            </div>
          ))}


        <br/>
        <button
          onClick={this.handleSubmit}
          disabled={this.hasActiveValidationErrors()} // Disable the button if there are active validation errors
        >
          Generar Factura - Texto
        </button>

        <br/>
        <br/>
        {this.state.selectedProyectosText && (
          <div>
            <h2>Codigo y Texto de factura:</h2>
            <h3>{this.state.selectedProyectosText}</h3>
          </div>
        )}
        <hr />
        <br/>
        </div>

        <br/>
        {this.state.randomString && (
        <h2>
          Usa esta clave: "{this.state.randomString.toUpperCase()}" 
          , para la comision de {this.state.miembroName} por la cantidad de 
          ${this.state.totalCommission.toLocaleString()}
        </h2>       
      )} 
      <br/>
        <button onClick={this.handleReset}>Resetear</button>
        <br/>
        
      </div>
    );
  
  }
  }

export default EstadoInstructor;
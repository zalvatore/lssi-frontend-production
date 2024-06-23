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
  API_URL_comision_multi,
  API_URL_comision_multi_codes,
  API_URL_partidas,
  API_URL_utilidad,
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

    //Partidas
    axios.get(API_URL_partidas, { headers })
    .then(res => {
      this.setState({ partidas: res.data });
      //console.log('partidas ->', this.state.partidas);
    })
    .catch(error => console.log(error));

    //Partners
    axios.get(API_URL_partners, { headers })
    .then(res => {
      this.setState({ partnersIVA: res.data });
    })
    .catch(error => console.log(error));

    //Utilidad
    axios.get(API_URL_utilidad, { headers })
    .then(res => {
      this.setState({ utilidades: res.data });
    })
    .catch(error => console.log(error));

    //Instructores
    getInstructores(headers)
    .then((instructores) => {
    this.setState({ instructores });    
    });

    axios.get(API_URL_instructores, { headers }) 
    .then((instructorsResponse) => {
      const instructors = instructorsResponse.data;
      this.setState({ instructors: instructors });

      axios.get(API_URL_partners, { headers })
      .then(partnersResponse => {
        const partners = partnersResponse.data;

          // Filter partners based on matching names with instructors
          const filteredPartners = partners.filter(partner =>
            instructors.some(instructor => partner.partner === instructor.instructor)
          );
          this.setState({ partners: filteredPartners });
          //console.log('partners ->', this.state.partners);
        })
        .catch(error => console.log("Error fetching partners:", error));
    })
    .catch(error => console.log("Error fetching instructors:", error));

    Promise.all([getProyectos(headers), getInstructores(headers)])
    .then(([proyectos, instructores]) => {
    // Create a map to quickly access proyectos by proyecto_code
    const proyectosMap = new Map();

    proyectos.forEach((proyecto) => {
      proyectosMap.set(proyecto.proyecto_code, proyecto);
    });

    // Now, you can associate proyectos with instructores based on proyecto_code
    const instructoresWithProyectos = instructores.map((instructor) => ({
      ...instructor,
      proyecto: proyectosMap.get(instructor.proyecto_code),
    }));

    // Filter out records where proyecto is undefined
    const filteredInstructoresWithProyectos = instructoresWithProyectos.filter(
      (instructor) => instructor.proyecto !== undefined
    );

    this.setState({ instructoresWithProyectos: filteredInstructoresWithProyectos });
    //console.log('Instructores with Proyectos ->', filteredInstructoresWithProyectos);
  })
  .catch((error) => console.log("Error fetching data:", error));

  Promise.all([getProyectos(headers), getPartidas(headers)])
    .then(([proyectos, partidas]) => {

    const proyectosMap = new Map();

    proyectos.forEach((proyecto) => {
      proyectosMap.set(proyecto.proyecto_code, proyecto);
    });

    const partidasWithProyectos = partidas.map((partida) => ({
      ...partida,
      proyecto: proyectosMap.get(partida.proyecto_code),
    }));

    const filteredPartidasWithProyectos = partidasWithProyectos.filter(
      (partida) => partida.proyecto !== undefined
    );

    this.setState({ partidasWithProyectos: filteredPartidasWithProyectos });
  })
  .catch((error) => console.log("Error fetching data:", error));

  Promise.all([getProyectos(headers), getUtilidades(headers)])
    .then(([proyectos, utilidades]) => {

    const proyectosMap = new Map();

    proyectos.forEach((proyecto) => {
      proyectosMap.set(proyecto.proyecto_code, proyecto);
    });

    const utilidadesWithProyectos = utilidades.map((utilidad) => ({
      ...utilidad,
      proyecto: proyectosMap.get(utilidad.proyecto_code),
    }));

    const filteredUtulidadesWithProyectos = utilidadesWithProyectos.filter(
      (utilidad) => utilidad.proyecto !== undefined
    );

    this.setState({ utilidadWithProyectos: filteredUtulidadesWithProyectos });
  })
  .catch((error) => console.log("Error fetching data:", error));

};



generateRandomString = (length) => {
  const characters = 'abcdefghjklmnpqrstuvwxyz23456789';
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

  handleToggle = (rowKey) => {
    this.setState((prevState) => {
      const toggleStates = { ...prevState.toggleStates };
      toggleStates[rowKey] = !toggleStates[rowKey];
      return { toggleStates };
    });
  };

  handleTogglePartida = (rowKey) => {
    this.setState((prevState) => {
      const toggleStatesPartida = { ...prevState.toggleStatesPartida };
      toggleStatesPartida[rowKey] = !toggleStatesPartida[rowKey];
      return { toggleStatesPartida };
    });
  };
  handleTogglePartidaIVA = (rowKey) => {
    this.setState((prevState) => {
      const toggleStatesPartidaIVA = { ...prevState.toggleStatesPartidaIVA };
      toggleStatesPartidaIVA[rowKey] = !toggleStatesPartidaIVA[rowKey];
      return { toggleStatesPartidaIVA };
    });
  };

  handleTogglePartidaRetencion = (rowKey) => {
    this.setState((prevState) => {
      const toggleStatesPartidaRetencion = { ...prevState.toggleStatesPartidaRetencion };
      toggleStatesPartidaRetencion[rowKey] = !toggleStatesPartidaRetencion[rowKey];
      return { toggleStatesPartidaRetencion };
    });
  };

  handleTogglePartidaISR = (rowKey) => {
    this.setState((prevState) => {
      const toggleStatesPartidaISR = { ...prevState.toggleStatesPartidaISR };
      toggleStatesPartidaISR[rowKey] = !toggleStatesPartidaISR[rowKey];
      return { toggleStatesPartidaISR };
    });
  };

  handleToggleUtilidad = (rowKey) => {
    this.setState((prevState) => {
      const toggleStatesUtilidad = { ...prevState.toggleStatesUtilidad };
      toggleStatesUtilidad[rowKey] = !toggleStatesUtilidad[rowKey];
      return { toggleStatesUtilidad };
    });
  };

  hasActiveValidationErrors = () => {
    const { validationErrors, validationErrorsCostos,validationErrorsUtilidades } = this.state;
  
    // Check if there are any errors in validationErrors
    const hasErrors = Object.values(validationErrors).some((error) => error !== null);
  
    // Check if there are any errors in validationErrorsCostos
    const hasCostosErrors = Object.values(validationErrorsCostos).some((error) => error !== null);

    // Check if there are any errors in validationErrorsCostos
    const hasUtilidadErrors = Object.values(validationErrorsUtilidades).some((error) => error !== null);
  
    // Return true if either validationErrors or validationErrorsCostos have errors
    return hasErrors || hasCostosErrors || hasUtilidadErrors;
  };
  
  

  handleMiembroChange = (event) => {
    const selectedPartner = event.target.value;
    const { 
      instructoresWithProyectos, 
      utilidadWithProyectos,
      partnersIVA,
      partidasWithProyectos
     } = this.state;
  
    const filteredInstructoresWithProyectos = instructoresWithProyectos.filter(data =>
      data.instructor === selectedPartner
    );

    const filteredPartidasWithProyectos = partidasWithProyectos.filter(data =>
      data.miembro_asignado === selectedPartner
    );

    const filteredUtilidadesWithProyectos = utilidadWithProyectos.filter(data =>
      data.partner === selectedPartner
    );
  
    const toggleStates = {};
    filteredInstructoresWithProyectos.forEach((proyecto) => {
      toggleStates[proyecto.pk] = false;
    });

    const toggleStatesPartida = {};
    filteredPartidasWithProyectos.forEach((data) => {
      toggleStatesPartida[data.pk] = false;
    });

    const toggleStatesPartidaIVA = {};
    filteredPartidasWithProyectos.forEach((data) => {
      toggleStatesPartidaIVA[data.pk] = true;
    });

    const toggleStatesPartidaRetencion = {};
    filteredPartidasWithProyectos.forEach((data) => {
      toggleStatesPartidaRetencion[data.pk] = true;
    });

    const toggleStatesPartidaISR = {};
    filteredPartidasWithProyectos.forEach((data) => {
      toggleStatesPartidaISR[data.pk] = true;
    });

    const toggleStatesUtilidad = {};
    filteredUtilidadesWithProyectos.forEach((data) => {
      toggleStatesUtilidad[data.pk] = false;
    });
  
    // Get partner data
    const partnerData = partnersIVA.filter(data =>
      data.partner === selectedPartner
    );
  
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
      selectedProyectosText:'', 
    });

    //
    //console.log("this.setState", this.state);

  };

  onChangeSemanas = (e, pk, horas) => {
    const inputValue = e.target.value || '1'; // default to '1'
    const max = e.target.max || '1';
  
    const inputValueFloat = parseFloat(inputValue);
    const maxFloat = parseFloat(max);
  
    if (isNaN(inputValueFloat) || isNaN(maxFloat)) {
      console.error('Invalid input or max value.'); // Handle invalid input values
      return;
    }
  
    const updatedHoras = inputValueFloat * horas;
  
    // Create new objects with updated values using object spread syntax
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
  
  handleSubmit = async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Token ${token}` };
      const username = Cookies.get("user");
      const { 
        selectedPartner, 
        partnerData,
        filteredInstructoresWithProyectos,
        filteredPartidasWithProyectos,
        filteredUtilidadesWithProyectos,
        toggleStatesUtilidad
      } = this.state;

      //console.log("filteredInstructoresWithProyectos:", filteredInstructoresWithProyectos);
  
      let randomHexCode = this.generateHexCode();

      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 5;

      while (!isUnique && attempts < maxAttempts) {
        randomHexCode = this.generateHexCode()
        randomHexCode = "FA" + randomHexCode;
        
          try {
            const response = await axios.get(API_URL_comision_multi_codes, { headers });
            const filteredData = response.data.filter(
              (comision_multi) => comision_multi.comision_multi_code === randomHexCode
            );
          
            if (filteredData.length === 0) {
              isUnique = true; // Exit the loop
            }
          } catch (error) {
            console.error("Error checking code existence:", error);
            return;
          }
          attempts++; // Increment the attempts counter
        }

        if (attempts === maxAttempts && !isUnique) {
          console.error("Max attempts reached. Could not generate a unique hex code.");
          // Handle the scenario where a unique code could not be generated within 5 attempts
        }

      const selectedProyectosText = filteredInstructoresWithProyectos
        .filter((data) => this.state.toggleStates[data.pk])
        .map((data) => {
          const horas = this.state.horas_de_semana_proyecto[data.pk] || 1;
          const semanasText = horas === 1 ? "Semana" : "Semanas";
          return `${data.proyecto.name} (${horas} ${semanasText})`;
        })
        .join(', ');

      const selectedProyectosPartidasText = filteredPartidasWithProyectos
        .filter((data) => this.state.toggleStatesPartida[data.pk])
        .map((data) => {
          const costos = this.state.costo_proyecto[data.pk] || 1;
          return `${data.proyecto.name}, ${data.partida} ($${costos})`;
        })
        .join(', ');

      //console.log('here') 
      //console.log('filteredUtilidadesWithProyectos',filteredUtilidadesWithProyectos)   
      //console.log('his.state',this.state)  
      //console.log('toggleStatesUtilidad',toggleStatesUtilidad) 

      const selectedProyectosUtilidadesText = filteredUtilidadesWithProyectos
        .filter((data) => toggleStatesUtilidad[data.pk])
        .map((data) => {
          const costos = this.state.costo_utilidad[data.pk] || 1;
          return `${data.proyecto.name}, ${data.tipo_utilidad} ($${costos})`;
        })
        .join(', ');
      
        //console.log('here2') 
      //const combinedText = `FA${randomHexCode} - ${selectedProyectosText}`;
      const combinedText = `${randomHexCode} - ${selectedProyectosText} - ${selectedProyectosPartidasText} - ${selectedProyectosUtilidadesText}`;
  
      //console.log("Selected Proyectos:", combinedText);
      //console.log("Random Hex Code:", randomHexCode);
  
      this.setState({ 
        selectedProyectosText: combinedText,
        randomHexCode });

        //console.log('this',this.state)        
  
      for (const data of filteredInstructoresWithProyectos
        .filter((data) => this.state.toggleStates[data.pk])) {
        //console.log("project:", data);
        const subcantidad = data.costo_hora * data.horas * (this.state.horas_de_semana_proyecto[data.pk] || 1);
        //console.log('semanas?',this.state.horas_de_semana_proyecto[data.pk])
        const cantidadIVA =  subcantidad * (partnerData[0].iva / 100)
        const cantidadISR =  subcantidad * (partnerData[0].isr / 100)
        //const cantidadRetencion =  subcantidad * (partnerData[0].retencion / 100)
        // A corregir 
        const cantidadRetencion =  subcantidad * (partnerData[0].iva / 3 * 2 / 100)
        const cantidad =
          subcantidad +
          subcantidad * (partnerData[0].iva / 100) -
          //subcantidad * (partnerData[0].retencion / 100) -
          // A corregir
          subcantidad * (partnerData[0].iva / 3 * 2 / 100) -
          subcantidad * (partnerData[0].isr / 100);
  
        const dataToSend = {
          proyecto: data.proyecto.name,
          proyecto_code: data.proyecto.proyecto_code,
          instructor_code: data.instructor_code,
          instructor: selectedPartner,
          mod_user:username,
          subcantidad,
          cantidad,
          iva: cantidadIVA,
          isr: cantidadISR,
          retencion: cantidadRetencion,
          comision_multi_code: randomHexCode,
          moneda: data.moneda,
          pago_por: 'Instructor',
        }; 
        
        //console.log("dataToSend:", dataToSend);
        await axios.post(API_URL_comision_multi, dataToSend, { headers });
        console.log("Data sent successfully for project:", data.proyecto.name);
      }

      console.log('filteredPartidasWithProyectos',filteredPartidasWithProyectos)

      for (const data of filteredPartidasWithProyectos
        .filter((data) => this.state.toggleStatesPartidaIVA[data.pk])) {
        //console.log("project:", data);
        const subcantidad = (this.state.costo_proyecto[data.pk] || 1) ;
        const cantidadIVA =  this.state.toggleStatesPartidaIVA[data.pk] ? subcantidad * (partnerData[0].iva / 100) : 0;
        const cantidadISR =  this.state.toggleStatesPartidaISR[data.pk] ? subcantidad * (partnerData[0].isr / 100) : 0;
        //const cantidadRetencion =  subcantidad * (partnerData[0].retencion / 100)
        // A corregir 
        const cantidadRetencion =  this.state.toggleStatesPartidaRetencion[data.pk] ? subcantidad * (partnerData[0].iva / 3 * 2 / 100) : 0;
        const cantidad =
              subcantidad +
              cantidadIVA -
              cantidadRetencion -
              cantidadISR;
  
        const dataToSend = {
          proyecto: data.proyecto.name,
          proyecto_code: data.proyecto.proyecto_code,
          instructor_code: data.instructor_code,
          instructor: selectedPartner,
          mod_user:username,
          subcantidad,
          cantidad,
          iva: cantidadIVA,
          isr: cantidadISR,
          retencion: cantidadRetencion,
          comision_multi_code: randomHexCode,
          moneda: data.moneda,
          pago_por: data.partida,
        }; 
        
        //console.log("dataToSend:", dataToSend);
        await axios.post(API_URL_comision_multi, dataToSend, { headers });
        console.log("Data sent successfully for project Costos:", data.proyecto.name);
      }

      for (const data of filteredUtilidadesWithProyectos
        .filter((data) => this.state.toggleStatesUtilidad[data.pk])) {
        //console.log("project:", data);
        const subcantidad = (this.state.costo_utilidad[data.pk] || 1) ;
        const cantidadIVA =  subcantidad * (partnerData[0].iva / 100)
        const cantidadISR =  subcantidad * (partnerData[0].isr / 100)
        //const cantidadRetencion =  subcantidad * (partnerData[0].retencion / 100)
        // A corregir 
        const cantidadRetencion =  subcantidad * (partnerData[0].iva / 3 * 2 / 100)
        const cantidad =
          subcantidad +
          subcantidad * (partnerData[0].iva / 100) -
          //subcantidad * (partnerData[0].retencion / 100) -
          // A corregir
          subcantidad * (partnerData[0].iva / 3 * 2 / 100) -
          subcantidad * (partnerData[0].isr / 100);
  
        const dataToSend = {
          proyecto: data.proyecto.name,
          proyecto_code: data.proyecto.proyecto_code,
          instructor_code: '',
          instructor: selectedPartner,
          mod_user:username,
          subcantidad,
          cantidad,
          iva: cantidadIVA,
          isr: cantidadISR,
          retencion: cantidadRetencion,
          comision_multi_code: randomHexCode,
          moneda: data.proyecto.moneda,
          pago_por: data.tipo_utilidad,
        }; 
        
        //console.log("dataToSend:", dataToSend);
        await axios.post(API_URL_comision_multi, dataToSend, { headers });
        console.log("Data sent successfully for project Costos:", data.proyecto.name);
      }

    } catch (error) {
      console.error("Error handling submissions:", error);
    }

    

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
    /*
    let totalSumSemanaPartidaNoViaticos = 0;

    if (filteredPartidasWithProyectos && filteredPartidasWithProyectos.length > 0) {
      totalSumSemanaPartidaNoViaticos = filteredPartidasWithProyectos.reduce((sum, proyecto) => {
        if (
          this.state.toggleStatesPartida[proyecto.pk] &&
          proyecto.partida && // Check if proyecto.partida is defined
          proyecto.partida.partida && // Check if proyecto.partida.partida is defined
          !proyecto.partida.partida.includes('Viáticos')
        ) {
          const projectTotal = costo_proyecto[proyecto.pk] || 1;
          return sum + projectTotal;
        }
        return sum;
      }, 0);
    }*/

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
                                onChange={() => this.handleToggle(proyecto.pk)}
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
                                onChange={() => this.handleTogglePartida(partida.pk)}
                                checked={this.state.toggleStatesPartida[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleTogglePartidaIVA(partida.pk)}
                                checked={this.state.toggleStatesPartidaIVA[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleTogglePartidaRetencion(partida.pk)}
                                checked={this.state.toggleStatesPartidaRetencion[partida.pk] || false}
                            />
                            </td>
                            <td>
                            <Switch
                                onChange={() => this.handleTogglePartidaISR(partida.pk)}
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
                                onChange={() => this.handleToggleUtilidad(utilidad.pk)}
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
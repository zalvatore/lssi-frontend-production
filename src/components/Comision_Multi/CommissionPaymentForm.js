import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { 
  getProyectos,
  getInstructores 
  /*getPartners */
} from "../../api-services";
import { 
  API_URL_comision_multi, 
  API_URL_partners,
  API_URL_instructores
} from "../../constants";

class CommissionPaymentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      proyectos: [],
      partners: [],
      projectName: "",
      miembroName: "",
      projectAmount: "",
      randomString: "",
      totalCommission: 0, 
      isMiembroDropdownEnabled: true,
      subTotalCommission: 0,
      iva: 0, 
      retencion: 0, 
      isr: 0,
      originalProyectos: [],
      instructores: [], 
      proyecto_instructor_filtered: {
        horas: 0,
        semanas: 0,
        costo_hora: 0
      },
      maxAmountError: false,
    };
  }

  componentDidMount() {

    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` }

    
    getInstructores(headers)
    .then((instructores) => {
    this.setState({ instructores });    
    })

    
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
          
        })
        .catch(error => console.log("Error fetching partners:", error));
    })
    .catch(error => console.log("Error fetching instructors:", error));

    /*
    axios.get(API_URL_partners, { headers })
    .then(res => {
      this.setState({ partners: res.data });
    })
    */

    getProyectos(headers)
    .then((proyectos) => {
      this.setState({ proyectos, originalProyectos: proyectos });
    })
    .catch((error) => console.log("Error fetching proyectos:", error));

    }

  handleProjectNameChange = (event) => {
    this.setState({ projectName: event.target.value });
    const { miembroName } = this.state;
    const projectfiltered = this.state.proyectos.find((data) => data.name === event.target.value  );
    const proyecto_instructor = this.state.instructores.find(
      (data) => data.proyecto_code === projectfiltered.proyecto_code &&
      data.instructor === miembroName
      );
    this.setState({ proyecto_instructor_filtered: proyecto_instructor});

  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  /*
  handleMiembroChange = (event) => {
    this.setState({ miembroName: event.target.value });
  };
  */

  handleProjectAmountChange = (event) => {
    const inputValue = parseInt(event.target.value);
    const maxAllowedAmount = this.calculateMaxProjectAmount();
  
    if (inputValue <= maxAllowedAmount) {
      this.setState({ projectAmount: inputValue, maxAmountError: false });
    } else {
      this.setState({ maxAmountError: true });
    }
  };

  calculateMaxProjectAmount = () => {
  const { proyecto_instructor_filtered } = this.state;

  if (proyecto_instructor_filtered) {
    const { horas, semanas, costo_hora } = proyecto_instructor_filtered;
    return horas * semanas * costo_hora;
  } else {
    return 0;
  }
};

handleMiembroChange = (event) => {
  const selectedPartner = event.target.value;
  const partner = this.state.partners.find((p) => p.partner === selectedPartner);
  const instructores = this.state.instructors;

  console.log("selectedPartner", selectedPartner);
  console.log("this.state.projectName", this.state.projectName);

  const instructor_filtrado = instructores.filter(
    (obj) => obj.instructor === selectedPartner
  );

  const proyecto_codes = instructor_filtrado.map((instructor) => instructor.proyecto_code);

  const proyectos_miembro = this.state.originalProyectos.filter((proyecto) =>
    proyecto_codes.includes(proyecto.proyecto_code)
  );

  if (partner) {
    this.setState((prevState) => ({
      miembroName: selectedPartner,
      iva: partner.iva,
      retencion: partner.retencion,
      isr: partner.isr,
      proyectos: proyectos_miembro,
      projectName: "", // Preserve the projectName
    }));
  } else {
    this.setState({
      miembroName: "",
      iva: 0,
      retencion: 0,
      isr: 0,
      proyectos: this.state.originalProyectos,
      projectName: "", // Reset the projectName
    });
  }
};


  handleAddProject = () => {
    const { projectName, projectAmount, projects } = this.state;

    // Check if projectAmount is null or less than one
    if (projectAmount === "" || parseFloat(projectAmount) < 1) {
      alert("Debe de indicar los honorarios del proyecto");
      return;
    }

    const newProject = { name: projectName, amount: parseFloat(projectAmount) };
    this.setState({
      projects: [...projects, newProject],
      projectName: "",
      projectAmount: "",
      isMiembroDropdownEnabled: false, // Disable the dropdown
    });
  };


  calculateSubTotalCommission = () => {
    const { projects } = this.state;
    return projects.reduce((total, project) => total + project.amount, 0);
  };

  calculateTotalCommission = () => {
    const {iva, retencion, isr } = this.state;
    const subTotal = this.calculateSubTotalCommission();
    const totalCommission = subTotal + (subTotal * (iva / 100)) - (subTotal * (retencion / 100)) - (subTotal * (isr / 100));
    return totalCommission;
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
  
  handleSubmit = async () => {
    const { projects, miembroName,iva, retencion, isr  } = this.state;
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    if (!miembroName) {
      alert("Por favor selecciona un miembro del equipo.");
      return;
    }
  
    if (projects.length === 0) {
      alert("Por favor agregue proyectos.");
      return;
    }

    let random_string;
    let codeExists = true;
    let totalCommission = 0; 
    while (codeExists) {
      random_string = this.generateRandomString(5);
      random_string = "M-" + random_string;
      
        try {
          const response = await axios.get(API_URL_comision_multi, { headers });
          const filteredData = response.data.filter(
            (comision_multi) => comision_multi.comision_multi_code === random_string
          );
        
          if (filteredData.length === 0) {
            codeExists = false; // Exit the loop
            this.setState({ randomString: random_string });
          }
        } catch (error) {
          console.error("Error checking code existence:", error);
          return;
        }
      }
  
    for (const project of projects) {
  
      const dataToSend = {
        //send: "data",
        proyecto: project.name,
        instructor: miembroName,
        subcantidad: project.amount,
        cantidad: project.amount + (project.amount * (iva / 100)) - (project.amount * (retencion / 100)) - (project.amount * (isr / 100)),
        comision_multi_code: random_string, // Add the generated code to the data
      };
  
      //console.log("dataToSend", dataToSend);
  
      try {
        axios.post(API_URL_comision_multi, dataToSend, { headers });
        //console.log("Data sent successfully:", response.data);
        totalCommission += project.amount;
      } catch (error) {
        console.error("Error sending data:", error);
      }
    }
    this.setState({
      projects: [],
      totalCommission,
    });
  };

  
  handleReset = () => {
    this.setState({
      isMiembroDropdownEnabled: true, // Disable the dropdown
      projectName: "",
      selectedPartner: "",
      projectAmount: "",
      randomString: "",
      totalCommission: 0,
      miembroName: "", 
      subTotalCommission: 0,
      iva: 0, 
      retencion: 0, 
      isr: 0, 
      proyecto_instructor_filtered: {
        horas: 0,
        semanas: 0,
        costo_hora: 0
      },
    });
  };
  

  render() {
    const { 
      projects,
      projectName, 
      projectAmount, 
      proyectos,
      partners,
      miembroName,
      isMiembroDropdownEnabled,
      proyecto_instructor_filtered,
      iva,
      retencion,
      isr,
     } = this.state;


  
    return (
      <div>
        <h2>Form pago de Honorarios</h2>
        <hr />
        <br/>
        <div>
          <div>
  
          <label>
            Miembro del equipo:
            <select
                value={miembroName}
                onChange={this.handleMiembroChange}
                disabled={!isMiembroDropdownEnabled}
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
          <div>
          <label>
            Nombre de proyectos:
            <select value={projectName} 
              onChange={this.handleProjectNameChange}
            >
              <option key='0' value="">Seleccionar Proyecto</option>
                {proyectos
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((proyecto) => (
                    <option key={proyecto.pk} value={proyecto.name}>
                      {proyecto.name}
                    </option>
                ))}
            </select>
          </label>
          </div>
          <br/>
          <div>
            <label>
            Honorarios del proyecto:
            <input
              type="number"
              value={projectAmount}
              onChange={this.handleProjectAmountChange}
              max={this.calculateMaxProjectAmount()}
            />
          </label>
          {this.state.maxAmountError && (
            <p style={{ color: 'red' }}>El monto ingresado supera el máximo permitido.</p>
          )}
          <button 
            onClick={this.handleAddProject}
            disabled={!this.state.projectName} 
          >Agregar</button>
        </div>
        
        <br/>
        <hr />
        <br/>
       
 
        {this.state.projectName && proyecto_instructor_filtered && (

            <div>
               <h3>Detalles Proyecto Seleccionado:</h3>
              <p>
                Horas: {proyecto_instructor_filtered.horas ?? 0}, Semanas: {proyecto_instructor_filtered.semanas}, Costo x hora: {proyecto_instructor_filtered.costo_hora}
              </p>
              <p>
              Total sin impuestos $: {this.calculateMaxProjectAmount().toLocaleString()}
              </p>
              <br/>
              <hr />
              <br/>
            </div>
          )}
        
        <h3>Proyectos Agregados:</h3>
          {projects.map((project, index) => (
            <div key={index}>
              <p>{project.name}: ${project.amount.toLocaleString()}</p>
            </div>
          ))}


        <br/>
        <button onClick={this.handleSubmit}>Submit Commission Payment</button>
        <br/>
        <br/>
        <hr />
        <br/>
        </div>
        <div>
          <h3>Total Honorarios:</h3>
          <p>Subtotal: ${this.calculateSubTotalCommission().toLocaleString()}</p>
          <p>IVA: {iva/100}%</p>
          <p>Retencion: {retencion/100}%</p>
          <p>ISR: {isr/100}%</p>
          <p>Total (Iva y retenciones): ${this.calculateTotalCommission().toLocaleString()}</p>
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

export default CommissionPaymentForm;
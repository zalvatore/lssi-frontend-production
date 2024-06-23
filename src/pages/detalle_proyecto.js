import React, { Component } from "react";
import { Col, Container, Row, Input, Label } from "reactstrap";
import axios from "axios";
import { 
  API_URL_proyectos,
  API_URL_instructores, 
  API_URL_partidas,
  API_URL_partidas_curso,
  API_URL_partidas_curso_abierto,
  API_URL_partners,
  API_URL_comision_multi,
  API_URL_utilidades_partners,
  API_URL_utilidades_byproject,
  API_URL_abierto_miembros,
  API_URL_lideres_profit,
} from "../constants";
import ProyectoIngresoModal from "../components/ProyectoDetail/Instructor/ProyectoIngresoModal";
import ProyectoCostoModal from "../components/ProyectoDetail/Partidas/ProyectoCostoModal";
import ProyectoDetailInstructorList from "../components/ProyectoDetail/Instructor/ProyectoDetailInstructorList"; 
import ProyectoDetailPartidasList from "../components/ProyectoDetail/Partidas/ProyectoDetailPartidasList"; 
import ProyectoDetailCursoList from "../components/ProyectoDetail/CursoCerradoEstudiantes/ProyectoDetailCursoList";
import ProyectoCursoModal from "../components/ProyectoDetail/CursoCerradoEstudiantes/ProyectoCursoModal";
import HonorariosList from "../components/ProyectoDetail/Honorarios/HonorariosList"
import Cookies from "js-cookie";
import CursoAbiertoList from "../components/ProyectoDetail/CursoAbierto/CursoAbiertoList";
import CursoAbiertoModal from "../components/ProyectoDetail/CursoAbierto/CursoAbiertoModal";
import AdminCursoList from "../components/ProyectoDetail/Admin de Curso/AdminCursoList";
import AdminCursoModal from "../components/ProyectoDetail/Admin de Curso/AdminCursoModal";
import AdminCursoModalCerrado from "../components/ProyectoDetail/Admin de Curso Cerrado/AdminCursoModalCerrado";
import AdminCursoListCerrado from "../components/ProyectoDetail/Admin de Curso Cerrado/AdminCursoListCerrado";
import IngresoGeneralModal from "../components/ProyectoDetail/Ingreso General/IngresoGeneralModal";
import IngresoGeneralList from "../components/ProyectoDetail/Ingreso General/IngresoGeneralList";
import ProyectoConCausaList from "../components/ProyectoDetail/Proyecto con Causa/ProyectoConCausaList";
import ProyectoConCausaModal from "../components/ProyectoDetail/Proyecto con Causa/ProyectoConCausaModal";
import ComisionVentaModal from "../components/ProyectoDetail/Comision de Venta/ComisionVentaModal";
import ComisionVentaList from "../components/ProyectoDetail/Comision de Venta/ComisionVentaList";
import {formatNumber} from "../components/utils";
import "./styles.css"; 

class DetalleProyectos extends Component {

  constructor(props) {
    super(props);
    
    this.token = Cookies.get("token");
    this.headers = { Authorization: `Token ${this.token}` };
  }
  state = {
    proyectos: [],
    selectedProyecto: null,
    utilidades_byproject: [],
    abierto_miembros: [],
    instructores: [],
    partidas: [],
    totalCosto: 0,
    totalCostoInstructors: 0,
    totalIngresoInstructors: 0,  
    showCursoCerrado: false,
    instructorsWithProportions: {},
    modalidadFilter: '', // New state for modalidad filter
    liderFilter: '', // New state for lider filter
    statusFilter:'',
    totalCommission:0,
    adminCostPercentage: 0.1,
    admins:[],
    adminsCerrado:[],
    admin_total_cost: 0,
    admin_total_cost_cerrado: 0,
    admin_proyecto_con_causa:0,
    total_cost_proyect_con_causa:0,
    comisionVenta:0,
    comision_venta_total:0,
    utilities: [],
    filteredlider: [],  
  };

  componentDidMount() {
    axios.get(API_URL_proyectos, { headers:this.headers })
      .then((response) => {
        const proyectos = response.data;
        this.setState({ proyectos });
        
      })
      .catch((error) => {
        console.error("Error fetching Proyectos:", error);
        
      });

      this.getpartners();
      this.getAdmin();
      this.getAdminCerrado();
      this.getIngresoGeneral();
      this.getProyectoConCausa();
      this.getComisionDeVenta();
      this.fetchUtilitiesByPartner();
      this.getProfitShare();

      //console.log('State', this.state)
  }

  handleProyectoChange = (e) => {
    const selectedProyectoName = e.target.value;
    const selectedProyecto = this.state.proyectos.find(
      (proyecto) => proyecto.name === selectedProyectoName
    );
  
    if (selectedProyecto) {
      const showCursoCerrado = selectedProyecto.tipo === "Curso Cerrado";
      this.setState({ selectedProyecto, showCursoCerrado });
      
      // First, get instructors
      this.getInstructores(selectedProyecto, () => {
        // Once instructors are loaded, get estudiantes
        this.getEstudiantes(selectedProyecto);
        this.getAdmin();
        this.getAdminCerrado();
        this.getIngresoGeneral();
        this.getProyectoConCausa();
        this.getComisionDeVenta();
        this.fetchUtilitiesByPartner();
        this.getProfitShare();
      });
    }
  };

   
  // Calculate the product of "semanas" and "horas" for each instructor
  calculateInstructorProducts(instructors) {
    // Check if any instructors have 'tarifa_hora' greater than zero
    const anyHaveTarifaHora = instructors.some(instructor => 
      instructor.tarifa_hora && instructor.tarifa_hora > 0
    );
  
    return instructors.map((instructor) => {
      let rate = instructor.costo_hora;  // Default to 'costo_hora'
      
      // If any instructor has 'tarifa_hora' greater than zero, use it
      if (anyHaveTarifaHora && instructor.tarifa_hora > 0) {
        rate = instructor.tarifa_hora;
      }
  
      const product = instructor.semanas * instructor.horas * rate;
      return { ...instructor, product };
    });
  }
  

  // Calculate the total product of "semanas" and "horas" for all instructors
  calculateTotalProduct(instructors) {
    return instructors.reduce((total, instructor) => total + instructor.product, 0);
  }

  // Calculate the proportion for each instructor based on their product relative to the total product
  calculateInstructorProportions(instructors, totalProduct) {
    return instructors.map((instructor) => ({
      ...instructor,
      proportion: totalProduct === 0 ? 0 : instructor.product / totalProduct,
    }));
  }

  
  getInstructores = (selectedProyecto, callback) => {
    if (selectedProyecto) {
      const axiosInstructores = axios.get(API_URL_instructores, { headers: this.headers })
        .then((res) => {
          const filteredInstructores = res.data.filter(
            (instructor) => instructor.proyecto_code === selectedProyecto.proyecto_code
          );

          // Calculate the product of "semanas" and "horas" for each instructor
          const instructorsWithProducts = this.calculateInstructorProducts(filteredInstructores);
          // Calculate the total product of "semanas" and "horas" for all instructors
          const totalProduct = this.calculateTotalProduct(instructorsWithProducts);
          // Calculate the proportion for each instructor
          const instructorsWithProportions = this.calculateInstructorProportions(instructorsWithProducts, totalProduct);


          this.setState({ 
            instructores: filteredInstructores,
            instructorsWithProportions
           });
          this.calculateTotalCostoInstructores(filteredInstructores); 
          this.calculateTotalIngresoInstructores(filteredInstructores);
        });
  
      const axiosPartidas = axios.get(API_URL_partidas, { headers: this.headers })
        .then((res) => {
          const filteredPartidas = res.data.filter(
            (partida) => partida.proyecto_code === selectedProyecto.proyecto_code
          );
          this.setState({ partidas: filteredPartidas });
          this.calculatePartidaCosto(filteredPartidas); 
          this.calculatePartidaIngreso(filteredPartidas);
        });
  
      const axiosPartidasCurso = axios.get(API_URL_partidas_curso, { headers: this.headers })
        .then((res) => {
          const filteredPartidasCurso = res.data.filter(
            (partida_curso) => partida_curso.proyecto_code === selectedProyecto.proyecto_code
          );
          this.setState({ partidas_curso: filteredPartidasCurso });
          this.setState({ estudiantes_curso_cerado: filteredPartidasCurso });
          this.calculateTotalIngresoCurso(filteredPartidasCurso);
        });

      const axiosCursoAbierto = axios.get(API_URL_partidas_curso_abierto, { headers: this.headers })
      .then((res) => {
        const filteredEstudiantes = res.data.filter(
          (estudiante) => estudiante.proyecto_code === selectedProyecto.proyecto_code
        );
        this.setState({ estudiantes_curso_abierto: filteredEstudiantes });
        this.calculateEstudiantesIngreso(filteredEstudiantes);
        this.calculateTotalCommission(filteredEstudiantes);
        //console.log("Estudiantes Curso Abierto:", filteredEstudiantes);
      })

  
      // Use Promise.all to wait for all axios requests to complete
      Promise.all([
        axiosInstructores, 
        axiosPartidas, 
        axiosPartidasCurso,
        axiosCursoAbierto
      ])
        .then(() => {
          // All requests completed, you can log the state and call the callback if provided
          //console.log('State End Horas Change ->', this.state);
          if (callback) {
            callback();
          }
        })
        .catch((error) => console.log(error));
    } else {
      // No selected proyecto, set instructores and partidas to empty arrays
      this.setState({ 
        //instructores: [], 
        partidas: []
      });
    }
  };
  

  getEstudiantes = (selectedProyecto) => {
    axios.get(API_URL_partidas_curso_abierto, { headers: this.headers })
        .then((res) => {
          const filteredEstudiantes = res.data.filter(
            (estudiante) => estudiante.proyecto_code === selectedProyecto.proyecto_code
          );
          this.setState({ estudiantes_curso_abierto: filteredEstudiantes });
        })

  }
  calculateTotalCommission = (filteredEstudiantes) => {
    let totalCommission = 0;
  
    // Iterate over filteredEstudiantes and calculate commission for each student
    filteredEstudiantes.forEach((estudiante) => {
      if (estudiante.comision_vendedor !== null) {
        totalCommission += (estudiante.comision_vendedor / 100) * estudiante.precio;
      }
    });
    this.setState({ totalCommission });
    //console.log("Total Commission:", totalCommission);
  };
  
  
  calculatePartidaCosto = (partidas) => {
    const partidaCosto = partidas.reduce(
      (sum, partida) => sum + partida.totalCost,
      0
    );
    this.setState({ partidaCosto });
  };

  calculatePartidaIngreso = (partidas) => {
    const partidaIngreso = partidas.reduce(
      (sum, partida) => sum + partida.totalPrice,
      0
    );
    this.setState({ partidaIngreso });
  };

  calculateEstudiantesIngreso = (estudiantes) => {
    const estudiantesIngreso = estudiantes.reduce(
      (sum, estudiante) => sum + estudiante.precio,
      0
    );
    this.setState({ estudiantesIngreso });
  };

  calculateTotalCostoInstructores = (instructores) => {
    const totalCostoInstructores = instructores.reduce(
      (sum, instructor) => sum + instructor.costo_hora * instructor.horas * instructor.semanas,
      0
    );
    this.setState({ totalCostoInstructores });
  };

  calculateTotalIngresoInstructores = (instructores) => {
    const totalIngresoInstructores = instructores.reduce(
      (sum, instructor) => sum + instructor.traifa_hora * instructor.horas * instructor.semanas,
      0
    );
    this.setState({ totalIngresoInstructores });
  };

  calculateTotalIngresoCurso = (partidas_curso) => {
    const totalIngresoCurso = partidas_curso.reduce(
      (sum, partida_curso) => sum + partida_curso.costo * partida_curso.cantidad,
      0
    );
    this.setState({ totalIngresoCurso });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  resetState = () => {
    this.getInstructores(this.state.selectedProyecto);
    this.getpartners();
    this.getAdmin();
    this.getAdminCerrado();
    this.getIngresoGeneral();
    this.getProyectoConCausa();
    this.getComisionDeVenta();
    this.fetchUtilitiesByPartner();
    this.getProfitShare();
  };

  handleModalidadFilterChange = (e) => {
    const modalidadFilter = e.target.value;
    this.setState({ modalidadFilter });
  };

  handleLiderFilterChange = (e) => {
    const liderFilter = e.target.value;
    this.setState({ liderFilter });
  };

  handleStatusFilterChange = (e) => {
    const statusFilter = e.target.value;
    this.setState({ statusFilter });
  };

  handleAdminCostChange = (event) => {
    const newAdminCostPercentage = parseFloat(event.target.value) || 0;
    this.setState({ adminCostPercentage: newAdminCostPercentage }, () => {
  
    });
  };

  getpartners = () => {
    axios.get(API_URL_partners, { headers: this.headers })
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

    getAdmin = () => {
      if (this.state.selectedProyecto) {
        axios.get(API_URL_comision_multi, { headers: this.headers })
          .then((response) => {
            const admins = response.data;
            const filteredAdmins = admins.filter(admin => 
              admin.proyecto_code === this.state.selectedProyecto.proyecto_code && 
              admin.pago_por === 'Admin de Curso'
            );
            
            const totalCost = filteredAdmins.reduce((acc, admin) => acc + admin.cantidad, 0);
            this.setState({ admins: filteredAdmins, admin_total_cost: totalCost });
          })
          .catch((error) => {
            console.error("Error fetching Admins:", error);
          });
      }  }

    fetchUtilitiesByPartner = () => {
      if (this.state.selectedProyecto) {
        axios.get(API_URL_utilidades_partners, { headers: this.headers }) // Assuming this function now requires a code and headers
          .then((response) => {
            const utilidades = response.data;
            const filteredUtilities = utilidades.filter(utility => 
              utility.proyecto_code === this.state.selectedProyecto.proyecto_code
            );
            const totalCantidad = filteredUtilities.reduce((sum, utility) => sum + utility.total_cantidad, 0);
            this.setState({ 
              utilities: filteredUtilities, 
              totalCantidad: totalCantidad 
            });
          })
          .catch(error => {
            console.error("Error fetching Utilities:", error);
          });
    
        axios.get(API_URL_utilidades_byproject, {
          params: { proyecto_code: this.state.selectedProyecto.proyecto_code },
          headers: this.headers,
        })
          .then((response) => {
            const utilidades_byproject = response.data;
            this.setState({ utilidades_byproject });
          })
          .catch(error => {
            console.error("Error fetching utilidades_byproject:", error);
          });

          axios.get(API_URL_abierto_miembros, {
            params: { proyecto_code: this.state.selectedProyecto.proyecto_code },
            headers: this.headers,
          })
            .then((response) => {
              const abierto_miembros = response.data;
              this.setState({ abierto_miembros });
            })
            .catch(error => {
              console.error("Error fetching abierto_miembros:", error);
            });


      }}

    getAdminCerrado = () => {
      if (this.state.selectedProyecto) {
        axios.get(API_URL_comision_multi, { headers: this.headers })
          .then((response) => {
            const admins = response.data;
            const filteredAdmins = admins.filter(admin => 
              admin.proyecto_code === this.state.selectedProyecto.proyecto_code && 
              admin.pago_por === 'Admin de Curso Cerrado'
            );
            const totalCost = filteredAdmins.reduce((acc, admin) => acc + admin.cantidad, 0);
            this.setState({ adminsCerrado: filteredAdmins, admin_total_cost_cerrado: totalCost });
          })
          .catch((error) => {
            console.error("Error fetching Admins Cerrado:", error);
          });
      } else {
        //console.error("selectedProyecto is null or undefined");
      }
    }

    getComisionDeVenta = () => {
      if (this.state.selectedProyecto) {
        axios.get(API_URL_comision_multi, { headers: this.headers })
          .then((response) => {
            const admins = response.data;
            const filteredAdmins = admins.filter(admin => 
              admin.proyecto_code === this.state.selectedProyecto.proyecto_code && 
              admin.pago_por === 'Comision de Venta'
            );
            const totalCost = filteredAdmins.reduce((acc, admin) => acc + admin.cantidad, 0);
            this.setState({ comisionVenta: filteredAdmins, comision_venta_total: totalCost });
          })
          .catch((error) => {
            console.error("Error fetching Comision de Venta:", error);
          });
      } 
    }

    getIngresoGeneral = () => {
      // Check if selectedProyecto is not null or undefined
      if (this.state.selectedProyecto) {
        axios.get(API_URL_comision_multi, { headers: this.headers })
          .then((response) => {
            const admins = response.data;
            const filteredAdmins = admins.filter(admin => 
              admin.proyecto_code === this.state.selectedProyecto.proyecto_code && 
              admin.pago_por === 'Ingreso en General'
            );
            
            // Sum up the cantidad property of all admins
            const totalCost = filteredAdmins.reduce((acc, admin) => acc + admin.cantidad, 0);  
            // Update the component state with the filtered admins and total cost
            this.setState({ ingresoGeneral: filteredAdmins, ingreso_General_total: totalCost });
          })
          .catch((error) => {
            console.error("Error fetching Ingreso General:", error);
          });
      } 
    }

    getProyectoConCausa = () => {

      // Check if selectedProyecto is not null or undefined
      if (this.state.selectedProyecto) {
        axios.get(API_URL_comision_multi, { headers: this.headers })
          .then((response) => {
            const admins = response.data;
            const filteredAdmins = admins.filter(admin => 
              admin.proyecto_code === this.state.selectedProyecto.proyecto_code && 
              admin.pago_por === 'Proyecto con Causa'
            );
            const totalCost = filteredAdmins.reduce((acc, admin) => acc + admin.cantidad, 0);
            this.setState({ admin_proyecto_con_causa: filteredAdmins, total_cost_proyect_con_causa: totalCost });
          })
          .catch((error) => {
            console.error("Error fetching Proyecto con Causa:", error);
          });
      } else {
        //console.error("selectedProyecto is null or undefined");
      }
    }

    getProfitShare = () => {
      if (this.state.selectedProyecto) {
        axios.get(API_URL_lideres_profit, { headers: this.headers })
          .then((response) => {
            const lideres = response.data;
            const filteredlider = lideres.filter(lider => 
              lider.lider === this.state.selectedProyecto.lider
            );
            this.setState({ filteredlider: filteredlider });
          })
          .catch((error) => {
            console.error("Error fetching filteredlider:", error);
          });
      } else {
        //console.error("selectedProyecto is null or undefined");
      }
    }
    

  render() {
    const { 
      proyectos, 
      selectedProyecto,
      partidas,
      partidaCosto,
      partidaIngreso,
      totalCostoInstructores,
      totalIngresoCurso,
      totalIngresoInstructores,
      instructores,
      instructorsWithProportions,
      estudiantesIngreso,
      modalidadFilter,
      liderFilter,
      statusFilter,
      totalCommission,
      partners,
      admins,
      adminsCerrado,
      admin_total_cost,
      admin_total_cost_cerrado,
      ingresoGeneral,
      ingreso_General_total,
      admin_proyecto_con_causa,
      total_cost_proyect_con_causa,
      comisionVenta,
      comision_venta_total,
       } = this.state;

      const partidasCount = partidas.length;
      const instructorCount = instructores.length;

      const ingreso = totalIngresoInstructores + totalIngresoCurso + partidaIngreso + estudiantesIngreso +ingreso_General_total
      const costo = totalCostoInstructores + partidaCosto + totalCommission + admin_total_cost + admin_total_cost_cerrado +total_cost_proyect_con_causa +comision_venta_total
      //const utilidad = ingreso - costo - this.state.totalCantidad
      const utilidad = ingreso - costo
      const margen = (utilidad / ingreso) * 100

    // Calculate total income for each instructor based on the proportion
    let instructorsWithTotalIncome = [];
    if (Array.isArray(instructorsWithProportions)) {
      instructorsWithTotalIncome = instructorsWithProportions.map((instructor) => {
        let totalIncome = 0;
        if (instructor.miembro_que_asigna !== "LSSI Europa") {
          totalIncome = utilidad * instructor.proportion * 0.125; // 12.5% de utilidad sobre asignacion de instructor
        }
        //console.log(instructor);
        return {
          ...instructor,
          totalIncome,
        };
      });
    }
    
    const modalidadOptions = Array.from(new Set(proyectos.map(proyecto => proyecto.modalidad)));
    const liderOptions = Array.from(new Set(proyectos.map(proyecto => proyecto.lider)));
    const statusOptions = Array.from(new Set(proyectos.map(proyecto => proyecto.status)));

    const filteredProyectos = proyectos.filter(proyecto => {
      if (modalidadFilter && proyecto.modalidad !== modalidadFilter) {
        return false;
      }
      if (liderFilter && proyecto.lider !== liderFilter) {
        return false;
      }
      if (statusFilter && proyecto.status !== statusFilter) {
        return false;
      }
      return true;
    });

    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Detalle Proyecto</h1>
        <Row>
          <Col>
            <Label for="modalidad">Selecciona Modalidad</Label>
            <Input
              type="select"
              name="modalidad"
              value={modalidadFilter}
              onChange={this.handleModalidadFilterChange}
            >
              <option value="">Todos</option>
              {modalidadOptions.map((modalidad, index) => (
                <option key={index} value={modalidad}>{modalidad}</option>
              ))}
            </Input>
          </Col>
          <Col>
            <Label for="lider">Selecciona Lider</Label>
            <Input
              type="select"
              name="lider"
              value={liderFilter}
              onChange={this.handleLiderFilterChange}
            >
              <option value="">Todos</option>
              {liderOptions.map((lider, index) => (
              <option key={index} value={lider}>{lider}</option>
            ))}
            </Input>
          </Col>
          <Col>
            <Label for="status">Selecciona Status</Label>
            <Input
              type="select"
              name="status"
              value={statusFilter}
              onChange={this.handleStatusFilterChange}
            >
              <option value="">Todos</option>
              {statusOptions.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
            </Input>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <Label for="proyecto">Selecciona Proyecto o Curso</Label>
            <Input
              type="select"
              name="proyecto"
              onChange={this.handleProyectoChange}
            >
              <option key='0' value="">Proyectos:</option>
              {/* Map over filtered proyectos */}
              {filteredProyectos
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort the array alphabetically by 'name'
                .map((proyecto) => (
                  <option key={proyecto.pk} value={proyecto.name}>
                    {proyecto.name} 
                  </option>
                ))}
            </Input>
          </Col>
        </Row>

        {selectedProyecto && (
          <div>
            <br/>

            <Row>
              <Col>
                <h1>Proyecto Code: {selectedProyecto.proyecto_code.toUpperCase()}</h1>
              </Col>
            </Row>
            <hr /> 
            <Row className="sticky-header">
              <Col>
                <h4>Ingreso: {formatNumber(ingreso)}</h4>
                <h4>Costo: {formatNumber(costo)}</h4>
                <h4>Utilidad: {formatNumber(utilidad)}</h4>
                <h4>Margen: {formatNumber(margen)}%</h4>
              </Col>
              <Col>
                <h5>Ingreso: {formatNumber(totalIngresoInstructores + totalIngresoCurso + estudiantesIngreso + ingreso_General_total)}</h5>
                <h5>Ingreso Otros (Viáticos, Materiales): {formatNumber(partidaIngreso)}</h5>
              </Col>
              <Col>
                <h5>Costo Instructores: {formatNumber(totalCostoInstructores)}</h5>
                <h5>Costo Comisiones de Venta: {formatNumber(comision_venta_total + totalCommission)}</h5>
                <h5>Costo Partidas: {formatNumber(partidaCosto)}</h5>
                <h5>Costo Admin del Curso: {formatNumber(admin_total_cost + admin_total_cost_cerrado)}</h5>
                <h5>Costo Proyecto con Causa: {formatNumber(total_cost_proyect_con_causa)}</h5>
              </Col>
            </Row>
            
            
            <hr /> 
              <div>
                  <Row>
                    <Col>
                      <Row> 
                      <Col><h2>Ingresos en General</h2></Col>
                      <Col>
                        <IngresoGeneralModal
                          create={true} 
                          resetState={this.resetState}
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          partners = {partners}
                          estudiantesIngreso = {totalIngresoCurso}
                        />
                    </Col>
                    <br></br>
                    </Row>

                    <Row>
                      <Col>
                        <IngresoGeneralList
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          partners = {partners}
                          resetState={this.resetState}
                          estudiantesIngreso = {totalIngresoCurso}
                          admins = {ingresoGeneral}
                        />
                      </Col>
                    </Row>

                  </Col>

                  </Row>
                </div>
                <hr /> 
            <h1>Instructores</h1>
            <Row>
              <Col>
                <ProyectoIngresoModal 
                create={true} 
                resetState={this.resetState}
                proyectoCodeSelected = {selectedProyecto.proyecto_code}
                proyectoNameSelected = {selectedProyecto.name}
                
                 />
              </Col>
            </Row>

            <div style={{ marginTop: "20px" }}>
              <h3>Numero de Instructores: {instructorCount}</h3>
              <h3>Ingreso de Instructores: {totalIngresoInstructores?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <h3>Costo de Instructores: {totalCostoInstructores?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            
            <Row>
              <Col>
                <ProyectoDetailInstructorList
                  instructores={this.state.instructores}
                  resetState={this.resetState}
                  itemsPerPage={8}
                  selectedProyecto = {selectedProyecto}
                  proyectoCodeSelected = {selectedProyecto.proyecto_code}
                  proyectoNameSelected = {selectedProyecto.name}
                />
              </Col>
            </Row>
            <hr />

            {selectedProyecto.modalidad && selectedProyecto.modalidad.includes('Cerrado') && (
             <div> 
                <div>
                  <Row>
                    <Col>
                      

                    <Row>
                      <Col>
                        <AdminCursoListCerrado
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          partners = {partners}
                          resetState={this.resetState}
                          estudiantesIngreso = {totalIngresoCurso}
                          admins = {adminsCerrado}
                        />
                      </Col>
                    </Row>

                  </Col>

                  </Row>
                </div>
            <h1>Curso Cerrado</h1>
            <Row>
              <Col>
                <ProyectoCursoModal 
                create={true} 
                resetState={this.resetState}
                proyectoCodeSelected = {selectedProyecto.proyecto_code}
                proyectoNameSelected = {selectedProyecto.name}
                 />
              </Col>
            </Row>

            <div style={{ marginTop: "20px" }}>
              <h3>Ingreso del Curso: {totalIngresoCurso?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            
            <Row>
              <Col>
                <ProyectoDetailCursoList
                  partidas_curso={this.state.partidas_curso}
                  resetState={this.resetState}
                  itemsPerPage={8}
                />
              </Col>
            </Row>
            <hr/>
            <Row>
                        <Col><h2>Administrador del Curso Cerrado</h2></Col>
                        <Col>
                          <AdminCursoModalCerrado 
                            create={true} 
                            resetState={this.resetState}
                            proyectoCodeSelected = {selectedProyecto.proyecto_code}
                            proyectoNameSelected = {selectedProyecto.name}
                            partners = {partners}
                            estudiantesIngreso = {totalIngresoCurso}
                          />
                      </Col>
                  </Row>
                  
            </div>
            )}

            {selectedProyecto.modalidad && selectedProyecto.modalidad.includes('Abierto')  && (
              <div> 
              <h1>Curso Abierto</h1>
              <Row>
                <Col>
                  <CursoAbiertoModal 
                    create={true} 
                    resetState={this.resetState}
                    proyectoCodeSelected = {selectedProyecto.proyecto_code}
                    proyectoNameSelected = {selectedProyecto.name}
                  />
                </Col>
              </Row>

              <div style={{ marginTop: "20px" }}>
                <h3>Ingreso del Curso Abierto: {estudiantesIngreso?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              
              <Row>
                <Col>
                  <CursoAbiertoList
                    estudiantes_curso_abierto={this.state.estudiantes_curso_abierto}
                    resetState={this.resetState}
                    proyectoCodeSelected = {selectedProyecto.proyecto_code}
                    proyectoNameSelected = {selectedProyecto.name}
                    utilidad={utilidad}
                    itemsPerPage={8}
                  
                  />
                </Col>
              </Row>
              <hr />
              <div>
              <Row>
                    <Col>
                    <h2>Comision de Venta Proyectos - Cursos Cerrados</h2>
                    <br></br>
                      <Row>
                        <Col>
                          <ComisionVentaModal
                            create={true} 
                            resetState={this.resetState}
                            proyectoCodeSelected = {selectedProyecto.proyecto_code}
                            proyectoNameSelected = {selectedProyecto.name}
                            partners = {partners}
                            estudiantesIngreso = {ingreso}
                          />
                      </Col>
                  </Row>
                  <br></br>

                    <Row>
                      <Col>
                        <ComisionVentaList
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          partners = {partners}
                          resetState={this.resetState}
                          estudiantesIngreso = {ingreso}
                          admins = {comisionVenta}
                        />
                      </Col>
                    </Row>

                  </Col>

                  </Row>
                  <hr />
                  <div>
                  <Row>
                    <Col>
                    <h2>Administrador del Curso</h2>
                    <br></br>
                      <Row>
                        <Col>
                          <AdminCursoModal 
                            create={true} 
                            resetState={this.resetState}
                            proyectoCodeSelected = {selectedProyecto.proyecto_code}
                            proyectoNameSelected = {selectedProyecto.name}
                            partners = {partners}
                            estudiantesIngreso = {estudiantesIngreso}
                          />
                      </Col>
                  </Row>

                    <Row>
                      <Col>
                        <AdminCursoList
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          partners = {partners}
                          resetState={this.resetState}
                          estudiantesIngreso = {estudiantesIngreso}
                          admins = {admins}
                        />
                      </Col>
                    </Row>

                  </Col>

                  </Row>
                </div>
              </div>
              </div>
            )}
            <hr />

                <div>
                  <Row>
                    <Col>
                    <h2>Proyecto con Causa</h2>
                    <br></br>
                      <Row>
                        <Col>
                          <ProyectoConCausaModal
                            create={true} 
                            resetState={this.resetState}
                            proyectoCodeSelected = {selectedProyecto.proyecto_code}
                            proyectoNameSelected = {selectedProyecto.name}
                            //partners = {partners}
                            estudiantesIngreso = {ingreso}
                          />
                      </Col>
                  </Row>
                  <br></br>

                    <Row>
                      <Col>
                        <ProyectoConCausaList
                          proyectoCodeSelected = {selectedProyecto.proyecto_code}
                          proyectoNameSelected = {selectedProyecto.name}
                          //partners = {partners}
                          resetState={this.resetState}
                          estudiantesIngreso = {ingreso}
                          admins = {admin_proyecto_con_causa}
                        />
                      </Col>
                    </Row>

                  </Col>

                  </Row>
                </div>
                
            
            <hr />
            <h1>Partidas Directo</h1>
            <Row>
              <Col>
                <ProyectoCostoModal 
                create={true} 
                resetState={this.resetState}
                proyectoCodeSelected = {selectedProyecto.proyecto_code}
                proyectoNameSelected = {selectedProyecto.name}
                instructores={this.state.instructores}
                 />
              </Col>
            </Row>
            
            <div style={{ marginTop: "20px" }}>
              <h3>Numero de Partidas: {partidasCount}</h3>
              <h3>Total Ingreso: {partidaIngreso?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              <h3>Total Costo: {partidaCosto?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            </div>
            
            <Row>
              <Col>
                <ProyectoDetailPartidasList
                  partidas={this.state.partidas}
                  instructores={this.state.instructores}
                  resetState={this.resetState}
                  itemsPerPage={8}
                />
              </Col>
            </Row>

            <hr />
            <h1>Reparto de Utilidades</h1>
            <br></br>

            <Row>
              <Col>
                <HonorariosList
                  proyectoNameSelected = {selectedProyecto.name}
                  partidas={this.state.partidas}
                  instructores={this.state.instructores}
                  instructoresProportions={
                    selectedProyecto.modalidad.includes('Abierto') ? null : instructorsWithTotalIncome
                  }
                  estudiantes_curso_abierto={this.state.estudiantes_curso_abierto}
                  resetState={this.resetState}
                  itemsPerPage={8}
                  utilidad={utilidad}
                  proyectoCodeSelected = {selectedProyecto.proyecto_code}
                  proyectoModalidadSelected = {selectedProyecto.modalidad}
                  proyectoLider = {selectedProyecto.lider}
                  totalCostoInstructores = {totalCostoInstructores}
                  partidaCosto = {partidaCosto}
                  admin_total_cost = {admin_total_cost}
                  total_cost_proyect_con_causa = {total_cost_proyect_con_causa}
                  utilities={this.state.utilities}
                  totalCantidad={this.state.totalCantidad}
                  utilidades_byproject={this.state.utilidades_byproject}
                  abierto_miembros={this.state.abierto_miembros}
                  filteredlider={this.state.filteredlider}
                />
              </Col>
            </Row>

            
          </div>
        )}
      </Container>
    );
  }
}

export default DetalleProyectos;

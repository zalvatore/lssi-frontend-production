    import React, { Component } from "react";
    import { Table, Input, Button } from "reactstrap";
    import { ToastContainer, toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";
    import Cookies from "js-cookie";
    import axios from "axios";
    import { 
        API_URL_partners,
        API_URL_utilidad,
    } from "../../../constants";

    class HonorariosList extends Component {

        constructor(props) {
            super(props);
        
            this.state = {
                partners: [],
                groupedByInstructor:[],

                contacto: '', 
                cita: "", 
                diagnostico: "", 
                propuesta: "", 
                cierre: "", 
                kickoff: "", 
                seguimiento: "", 
                reunioncierre: "", 


                honorarios: {
                    contacto: '', 
                    cita: "", 
                    diagnostico: "", 
                    propuesta: "", 
                    cierre: "", 
                    kickoff: "", 
                    seguimiento: "", 
                    reunioncierre: "", 
                    coaching: "",

                },

                percent:{
                    contacto: 3.75, 
                    cita: 3.75, 
                    diagnostico: 2.5, 
                    propuesta: 5, 
                    cierre: 2.5, 
                    kickoff: 2.5, 
                    seguimiento: 2.5, 
                    reunioncierre: 2.5, 
                    coaching: 12.5,
                },
            
                amount: {
                    contacto: 0,
                    cita: 0, 
                    diagnostico: 0,
                    propuesta: 0, 
                    cierre: 0, 
                    kickoff: 0,
                    seguimiento: 0,
                    reunioncierre: 0, 
                    coaching: 0,
            },
            };
        }

        componentDidMount() {

        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` }
        this.fetchUtilidadData();

        axios
        .get(API_URL_partners, { headers })
        .then((response) => {
            const partners = response.data;
            partners.sort((a, b) => a.partner.localeCompare(b.partner));
            this.setState({ partners });
        })
        .catch((error) => {
            console.error("Error fetching equipo:", error);
        });

        this.calculateTotalPrecios();
        this.getUtilidadesData();
        }

        componentDidUpdate(prevProps) {
            // Check if proyectoCodeSelected prop has changed
            if (this.props.proyectoCodeSelected !== prevProps.proyectoCodeSelected) {
                this.setState({
    
                    honorarios: {
                        reference: '', 
                        contacto: '', 
                        cita: "", 
                        diagnostico: "", 
                        propuesta: "", 
                        cierre: "", 
                        kickoff: "", 
                        directo: "", 
                        visitas: "", 
                        evaluaciones: "",
                    },
           
                    amount: {
                        reference: 0, 
                        contacto: 0, 
                        cita: 0, 
                        diagnostico: 0, 
                        propuesta: 0, 
                        cierre: 0, 
                        kickoff: 0, 
                        directo: 0, 
                        visitas: 0, 
                        evaluaciones: 0, 
                    },
                });
                
              this.fetchUtilidadData();
              
            };

            if (prevProps.estudiantes_curso_abierto !== this.props.estudiantes_curso_abierto) {
                this.calculateTotalPrecios();
              };
          }

        calculateTotalPrecios = () => {
            const { estudiantes_curso_abierto } = this.props;
            if (estudiantes_curso_abierto && Array.isArray(estudiantes_curso_abierto)) {
                const totalPrecioByVendedor = {};
                let totalPrecioAllVendedores = 0;

                estudiantes_curso_abierto.forEach(estudiante => {
                    const { miembro_vendedor, precio, moneda } = estudiante;
                    if (miembro_vendedor && precio !== null && precio !== undefined) {
                        if (!totalPrecioByVendedor[miembro_vendedor]) {
                            totalPrecioByVendedor[miembro_vendedor] = {
                                totalPrecio: 0,
                                moneda: moneda // Store the currency for each vendor
                            };
                        }
                        totalPrecioByVendedor[miembro_vendedor].totalPrecio += precio;
                    }
                });

                // Calculate total price for all vendors
                totalPrecioAllVendedores = Object.values(totalPrecioByVendedor).reduce((acc, vendor) => acc + vendor.totalPrecio, 0);

                this.setState({ totalPrecioByVendedor, totalPrecioAllVendedores });
            }
        };

        fetchUtilidadData(){
            const token = Cookies.get("token"); 
            const headers = { Authorization: `Token ${token}` }
            axios
            .get(API_URL_utilidad, { headers })
            .then((response) => {
                const data = response.data;
                if (data.length > 0) {
                    // Filter the data based on proyecto_code
                    const filteredData = data.filter((item) => item.proyecto_code === this.props.proyectoCodeSelected);
                    //console.log('filteredData', filteredData)
                    if (filteredData.length > 0) {
                        // Data exists for proyectoCodeSelected, update state with fetched values
                        const newAmount = { ...this.state.amount };
                        const newPercent = { ...this.state.percent };
                        const newHonorarios = { ...this.state.honorarios };

                        filteredData.forEach((item) => {
                            const utilidadType = item.tipo_utilidad;
                            newAmount[utilidadType] = item.cantidad;
                            newPercent[utilidadType] = item.porcentaje;
                            newHonorarios[utilidadType] = item.partner;
                        });

                        this.setState({
                            amount: newAmount,
                            percent: newPercent,
                            honorarios: newHonorarios,
                        });
                    }
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
        }

        onChange = (e) => {
            const { percent, amount, honorarios } = this.state;
            const { utilidad } = this.props;
            const thisPercent = percent[e.target.name];
            let newAmount = (utilidad * thisPercent) / 100;
            //console.log('e.target.key',e.target.value)
        
            // Check if e.target.key is zero
            if (e.target.value === "") {
                this.setState(
                    {
                        [e.target.name]: 0, // Set e.target.name to zero
                        amount: {
                            ...amount,
                            [e.target.name]: 0, // Set amount[e.target.name] to zero
                        },
                        honorarios: {
                            ...honorarios,
                            [e.target.name]: 0, // Set honorarios[e.target.name] to zero
                        },
                    },
                    () => {
                        this.getUtilidadesData();
                    }
                );
            } else {
                this.setState(
                    {
                        [e.target.name]: e.target.value,
                        amount: {
                            ...amount,
                            [e.target.name]: newAmount,
                        },
                        honorarios: {
                            ...honorarios,
                            [e.target.name]: e.target.value,
                        },
                    },
                    () => {
                        this.getUtilidadesData();
                    }
                );
            }
            
        };   

        calculateTotalAmount() {
            const { amount } = this.state;
            let total = 0;
        
            for (const key in amount) {
            if (amount.hasOwnProperty(key)) {
                const value = parseFloat(amount[key]);
                if (!isNaN(value)) {
                total += value;
                }
            }
            }
        
            return total;
        }

        calculateTotalIncome() {
            const { instructoresProportions } = this.props;
            let totalIncomeSum = 0;
    
            if (Array.isArray(instructoresProportions)) {
                totalIncomeSum = instructoresProportions.reduce((total, partner) => {
                    return total + (partner.totalIncome || 0);
                }, 0);
            }
    
            return totalIncomeSum;
        }

        calculateUtilidadVendedor() {
            const { totalPrecioAllVendedores } = this.state;
            let total = 0;
    
            if (totalPrecioAllVendedores > 0) {
                total = this.props.utilidad  * .5;
                } else {
                    total = 0
                }
        
            return total;
        }

        handleSubmit = () => {

            const token = Cookies.get("token"); 
            const headers = { Authorization: `Token ${token}` }

            const { 
                honorarios,
                percent,
                amount 
            } = this.state;

            const { instructoresProportions } = this.props;

            let errorMessage = false;
        
            for (const key in honorarios) {
                if (honorarios.hasOwnProperty(key)) {
                    //console.log('honorarios', key, honorarios[key]);
                    //console.log('percent', key, percent[key]);
                    //console.log('amount', key, amount[key]);

                    const dataToSend = {
                        proyecto_code: this.props.proyectoCodeSelected,
                        tipo_utilidad: key,
                        porcentaje: percent[key],
                        cantidad: amount[key],
                        partner: honorarios[key],
                    }; 

                    axios.post(API_URL_utilidad, dataToSend, { headers })
                    .then(response => {
                        //console.log("Request was loaded successfully:", response.data);
                    })
                    .catch(error => {
                        //console.error("An error occurred while loading:", error);
                        errorMessage = true; 
                    });
            
                
                }
            }

            for (const key in instructoresProportions) {
                if(instructoresProportions.hasOwnProperty(key)){
                    //console.log('X', instructoresProportions[key].miembro_que_asigna);
                    const row = parseInt(key) + 1

                    const dataToSend = {
                        proyecto_code: this.props.proyectoCodeSelected,
                        tipo_utilidad: "Asignacion - " + row, 
                        porcentaje: instructoresProportions[key].proportion * 12.5, //12.5% de asignacion
                        cantidad: instructoresProportions[key].totalIncome,
                        partner: instructoresProportions[key].miembro_que_asigna,
                    }; 

                    axios.post(API_URL_utilidad, dataToSend, { headers })
                    .then(response => {
                        //console.log("instructoresProportions was loaded successfully:", response.data);
                    })
                    .catch(error => {
                        //console.error("An error occurred while loading instructoresProportions:", error);
                        errorMessage = true;  
                    });

                }
            }

            if (errorMessage) {
                // Show a success message
                toast.error("Error al guardar datos, favor de verificar", {
                  position: "top-center",
                  autoClose: 3000, // Close the message after 3 seconds
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored"
                });
              } else {
                // Show an error message
                toast.success("Informacion guardada!", {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored"
                });    
              }

        };

        getUtilidadesData() {
            const { honorarios, amount } = this.state;
            //const UtilidadesData = {};
            const groupedByInstructor = {};
        
            for (const key in honorarios) {
                if (honorarios.hasOwnProperty(key)) {
                    const amountValue = parseFloat(amount[key]);
        
                    if (!isNaN(amountValue)) {
                        // If UtilidadesData[key] is not defined, initialize it with an object
                        /*if (!UtilidadesData[key]) {
                            UtilidadesData[key] = {
                                instructor: honorarios[key], // include honorario name
                                totalIncome: 0 // Initialize totalIncome to 0
                            };
                        }
        
                        // Update totalIncome by adding current amountValue
                        UtilidadesData[key].totalIncome += amountValue;*/
        
                        // Group by instructor if it's not null
                        const instructor = honorarios[key];
                        if (instructor !== "") {
                            if (!groupedByInstructor[instructor]) {
                                groupedByInstructor[instructor] = 0;
                            }
                            groupedByInstructor[instructor] += amountValue;
                        }
                    }
                }
            }
        
            //console.log('UtilidadesData', UtilidadesData);
            //console.log('GroupedByInstructor', groupedByInstructor);
            this.setState({
                groupedByInstructor
            });
        }
        
    

            renderGroupedData = (combinedData, keyName, valueName, formatValue) => {
                console.log('combined:',combinedData)
                // Function to group and sum combinedData by key
                const groupAndSumData = () => {
                    const groupedData = {};
            
                    // Loop through combinedData
                    combinedData.forEach(item => {
                        const key = item[keyName];
            
                        // If key doesn't exist in groupedData, initialize it
                        if (!groupedData[key]) {
                            groupedData[key] = {
                                [keyName]: key,
                                [valueName]: 0
                            };
                        }
            
                        // Add item.value to the corresponding key
                        groupedData[key][valueName] += item[valueName];
                    });
            
                    // Convert object to array
                    const groupedArray = Object.values(groupedData);
                    return groupedArray;
                };
            
                // Grouped and summed data
                const groupedData = groupAndSumData();
            
                // Render grouped and summed data
                return (
                    <div>
                        <h3>Utilidad por miembro</h3>
                        <Table responsive hover striped bordered>
                            <thead>
                                <tr>
                                    <th>Recibe Utilidad</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item[keyName]}</td>
                                        <td>{formatValue ? formatValue(item[valueName]) : item[valueName]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                );
            }
            
        
        
        

        render() {

            let combinedData = [];

            if (Array.isArray(this.props.instructoresProportions) && this.state.groupedByInstructor) {
                combinedData = [
                    ...this.props.instructoresProportions,
                    ...Object.entries(this.state.groupedByInstructor).map(([miembro_que_asigna, totalIncome]) => ({ miembro_que_asigna, totalIncome }))
                ];
            } else if (Array.isArray(this.props.instructoresProportions)) {
                combinedData = [...this.props.instructoresProportions];
            } else if (this.state.groupedByInstructor) {
                combinedData = Object.entries(this.state.groupedByInstructor).map(([miembro_que_asigna, totalIncome]) => ({ miembro_que_asigna, totalIncome }));
            }


            const {
                partners,
                percent,         
                amount,
                honorarios,
            } = this.state;

            //const { utilidad } = this.props;
        
            //const totalAmount = this.calculateTotalAmount();
            //const totalAmountAsignacion = this.calculateTotalIncome();
            //const UtilidadVendedor = this.calculateUtilidadVendedor();
            //const utilidad_lssi =  this.props.utilidad - totalAmount - totalAmountAsignacion -UtilidadVendedor;
            const lider = this.props.proyectoLider

            let utilidad_lssi;
            let utilidad_Europa;
            if (lider === 'LSSI Europa') {
                utilidad_lssi = this.props.utilidad* 0.5;
                utilidad_Europa = this.props.utilidad* 0.5;
                } else {
                utilidad_lssi = this.props.utilidad; 
                utilidad_Europa = null
                }



            return(
                
                <div>
                    {this.props.proyectoModalidadSelected && !this.props.proyectoModalidadSelected.includes('Abierto') && (
                    <div>
                    <Table responsive hover striped bordered>
                        <thead>
                            <tr>
                            <th>Tipo de Utilidad</th>
                            <th>Utilidad</th>
                            <th>Miembro</th>
                            <th>Porcentaje</th>
                            <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key='1' className="table-primary">
                                <td>Preventa</td>
                                <td>Contacto</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="contacto"
                                        value={honorarios.contacto}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Contacto:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.contacto.toFixed(2)}%</td>
                                <td>{amount.contacto?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='2' className="table-primary">
                                <td>Preventa</td>
                                <td>Cita</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="cita"
                                        value={honorarios.cita}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Cita:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.cita.toFixed(2)}%</td>
                                <td>{amount.cita?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='3' className="table-success">
                                <td>Comercial</td>
                                <td>Diagnostico</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="diagnostico"
                                        value={honorarios.diagnostico}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Diagnostico:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.diagnostico.toFixed(2)}%</td>
                                <td>{amount.diagnostico?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='4' className="table-success">
                                <td>Comercial</td>
                                <td>Propuesta y Negociacion</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="propuesta"
                                        value={honorarios.propuesta}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Propuesta:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.propuesta.toFixed(2)}%</td>
                                <td>{amount.propuesta?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='5' className="table-success">
                                <td>Comercial</td>
                                <td>Cierre</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="cierre"
                                        value={honorarios.cierre}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Cierre:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.cierre.toFixed(2)}%</td>
                                <td>{amount.cierre?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='6' className="table-warning">
                                <td>Post Venta</td>
                                <td>Kick Off</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="kickoff"
                                        value={honorarios.kickoff}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Kick off:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.kickoff.toFixed(2)}%</td>
                                <td>{amount.kickoff?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr key='7' className="table-warning">
                                <td>Post Venta</td>
                                <td>Seguimiento</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="seguimiento"
                                        value={honorarios.seguimiento}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Contacto Directo:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.seguimiento.toFixed(2)}%</td>
                                <td>{amount.seguimiento?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                            </tr>
                            <tr key='8' className="table-warning">
                                <td>Post Venta</td>
                                <td>Reunion de Cierre</td>
                                <td>
                                    <Input
                                        type="select"
                                        name="reunioncierre"
                                        value={honorarios.reunioncierre}
                                        onChange={this.onChange}
                                    >
                                        <option key= '0' value="">Reunion de Cierre:</option>
                                        {Array.isArray(partners) && partners.map(partner => (
                                        <option key={partner.pk} value={partner.partner}>
                                            {partner.partner}
                                        </option>
                                        ))}
                                    </Input>
                                </td>
                                <td>{percent.reunioncierre.toFixed(2)}%</td>
                                <td>{amount.reunioncierre?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr key='10'>
                                <td>Desarollo de Equipo</td>
                                <td>Coaching/Lider</td>
                                <td>
                                    {this.props.proyectoLider}
                                </td>
                                <td>{percent.coaching.toFixed(2)}%</td>
                                <td>{amount.coaching?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            
                        </tbody>
                    </Table>
                    </div>
                    )}

                    {this.props.proyectoModalidadSelected && !this.props.proyectoModalidadSelected.includes('Abierto') && (
                    <div>  
                    <h3>Utilidad de Partner que Asigna</h3>                       
                    < Table responsive hover striped >
                        <thead>
                            <tr>
                                <th>Tipo de Utilidad</th>
                                <th>Partner que asigna</th>
                                <th>Instructor</th>
                                <th>Proporción (%)</th>
                                <th>Utilidad (%)</th>
                                <th>Cantidad</th>
                                <th>Moneda</th>

                            </tr>
                        </thead>
                        <tbody>
                            
                            {(!this.props.instructoresProportions || !Array.isArray(this.props.instructoresProportions) || this.props.instructoresProportions.length === 0) ? (
                                <tr>
                                    <td colSpan="15" align="center">
                                        <b>Ups, todavía no hay !!</b>
                                    </td>
                                </tr>
                            ) : (
                                this.props.instructoresProportions.map(partner => (
                                    <tr key={partner.pk}>
                                        <td>Desarollo de Equipo</td>
                                        <td>{partner.miembro_que_asigna}</td>
                                        <td>{partner.instructor}</td>
                                        <td>{(partner.proportion * 100).toFixed(2)}%</td>
                                        <td>{(partner.proportion * 100 * 0.125).toFixed(2)}%</td>
                                        <td>{partner.totalIncome?.toLocaleString('en-US', 
                                    { style: 'currency', currency: 'USD' })}</td>
                                        <td>{partner.moneda}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    
                    </Table>
                    </div>  
                    )}
                    <br />
                    <hr />

                    <br />
                    < Button 
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        Guardar Datos
                    </Button>
                    <ToastContainer />
                    <br />
                    <hr />
                    <div>
                        {this.renderGroupedData(combinedData, 'miembro_que_asigna', 'totalIncome', value => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' }))}
                    </div>
                    <hr />
                    <div>
                        <h2>Utilidad LSSI {utilidad_lssi?.toLocaleString(undefined, 
                                    { style: 'currency', currency: 'USD' })}</h2>
                        {utilidad_Europa && (
                            <h2>Utilidad LSSS Europa {utilidad_Europa?.toLocaleString(undefined, 
                            { maximumFractionDigits: 2})}</h2>
                        )
                        }

                    </div>

                </div>
            )
        }

    }

    export default HonorariosList
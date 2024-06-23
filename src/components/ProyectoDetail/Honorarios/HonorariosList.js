import React, { Component } from "react";
import { Table, Input, Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import axios from "axios";
import { 
    API_URL_partners,
    API_URL_utilidad,
    API_URL_utilidad_partner_curso_abierto,
} from "../../../constants";
import { formatNumber } from "../../utils";
import emailjs from '@emailjs/browser';

class HonorariosList extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            partners: [],
            honorarios: this.initializeHonorarios(),
            percent: this.initializePercent(),
            amount: this.initializeAmount(),
        };
    }

    initializeHonorarios() {
        return {
            contacto: "", 
            cita: "", 
            diagnostico: "", 
            propuesta: "", 
            cierre: "", 
            kickoff: "", 
            seguimiento: "", 
            reunioncierre: "", 
            coaching: "",
        };
    }

    initializePercent() {
        return {
            contacto: 3.75, 
            cita: 3.75, 
            diagnostico: 2.5, 
            propuesta: 5, 
            cierre: 2.5, 
            kickoff: 2.5, 
            seguimiento: 2.5, 
            reunioncierre: 2.5, 
            coaching: 12.5,
        };
    }

    initializeAmount() {
        return {
            contacto: 0,
            cita: 0, 
            diagnostico: 0,
            propuesta: 0, 
            cierre: 0, 
            kickoff: 0,
            seguimiento: 0,
            reunioncierre: 0, 
            coaching: 0,
        };
    }

    async componentDidMount() {
        const token = Cookies.get("token"); 
        if (!token) {
            console.error("No token found");
            return;
        }
        const headers = { Authorization: `Token ${token}` }
    
        try {
            const response = await axios.get(API_URL_partners, { headers });
            const partners = response.data;
            partners.sort((a, b) => a.partner.localeCompare(b.partner));
            this.setState({ partners });
            await this.fetchUtilidadData();
            this.calculateTotalPrecios();
        } catch (error) {
            console.error("Error in componentDidMount:", error);
        }
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.proyectoCodeSelected !== prevProps.proyectoCodeSelected) {
            this.resetState();
        }

        if (prevProps.estudiantes_curso_abierto !== this.props.estudiantes_curso_abierto) {
            this.calculateTotalPrecios();
        }
    }

    resetState() {
        this.setState({
            honorarios: this.initializeHonorarios(),
            amount: this.initializeAmount(),
        }, this.fetchUtilidadData);
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
                            moneda: moneda 
                        };
                    }
                    totalPrecioByVendedor[miembro_vendedor].totalPrecio += precio;
                }
            });

            totalPrecioAllVendedores = Object.values(totalPrecioByVendedor).reduce((acc, vendor) => acc + vendor.totalPrecio, 0);

            this.setState({ totalPrecioByVendedor, totalPrecioAllVendedores });
        }
    };

    fetchUtilidadData = async () => {
        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` }
        try {
            const response = await axios.get(API_URL_utilidad, { headers });
            const data = response.data.filter((item) => item.proyecto_code === this.props.proyectoCodeSelected);
            if (data.length > 0) {
                const newAmount = { ...this.state.amount };
                const newPercent = { ...this.state.percent };
                const newHonorarios = { ...this.state.honorarios };

                data.forEach((item) => {
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
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    onChange = (e) => {
        const { percent, amount, honorarios } = this.state;
        const { utilidad } = this.props;
        const thisPercent = percent[e.target.name];
        let newAmount = (utilidad * thisPercent) / 100;

        const value = e.target.value === "" ? 0 : e.target.value;
        this.setState(
            {
                [e.target.name]: value,
                amount: {
                    ...amount,
                    [e.target.name]: newAmount,
                },
                honorarios: {
                    ...honorarios,
                    [e.target.name]: value,
                },
            }
        );
    };   

    handleSubmit = async () => {
        const token = Cookies.get("token"); 
        const headers = { Authorization: `Token ${token}` }
    
        const { honorarios, percent, amount } = this.state;
        const { instructoresProportions } = this.props;
    
        let errorMessage = false;

        const postRequest = async (dataToSend) => {
            try {
                await axios.post(API_URL_utilidad, dataToSend, { headers });
                console.log("Data was loaded successfully");
            } catch (error) {
                console.error("An error occurred:", error);
                errorMessage = true;
            }
        }
    
        const honorariosPromises = Object.keys(honorarios).map(key => {
            if (honorarios[key]) {
                const dataToSend = {
                    proyecto_code: this.props.proyectoCodeSelected,
                    tipo_utilidad: key,
                    porcentaje: percent[key],
                    cantidad: amount[key],
                    partner: honorarios[key],
                };
                return postRequest(dataToSend);
            }
            return null; 
        }).filter(Boolean); 
    
        const instructoresPromises = Object.keys(instructoresProportions).map(key => {
            if (instructoresProportions[key]) {
                const row = parseInt(key) + 1;
                const dataToSend = {
                    proyecto_code: this.props.proyectoCodeSelected,
                    tipo_utilidad: "Asignacion - " + row, 
                    porcentaje: instructoresProportions[key].proportion * 12.5,
                    cantidad: instructoresProportions[key].totalIncome,
                    partner: instructoresProportions[key].miembro_que_asigna,
                };
                return postRequest(dataToSend);
            }
            return null; 
        }).filter(Boolean); 
    
        await Promise.all([...honorariosPromises, ...instructoresPromises]);
        
        if (errorMessage) {
            toast.error("Error al guardar datos, favor de verificar", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored"
            });
        } else {
            toast.success("Información guardada!", {
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

    calculateComision = () => {
        const { 
            estudiantes_curso_abierto, 
            totalCostoInstructores, 
            partidaCosto,
            admin_total_cost,
            total_cost_proyect_con_causa 
        } = this.props;
    
        const { utilidad_lssi } = this.calculateUtilidades() || {};
    
        if (typeof utilidad_lssi !== 'number') {
            return { totalComissionByVendor: {}, totalUtilidadByAllVendors: 0 };
        }
    
        if (!Array.isArray(estudiantes_curso_abierto) || estudiantes_curso_abierto.length === 0) {
            return { totalComissionByVendor: {}, totalUtilidadByAllVendors: 0 };
        }
    
        const totalComissionByVendor = {};
        let totalSalesByAllVendors = 0;
        let totalUtilidadByAllVendors = 0;
        let totalLineItemCount = 0;
    
        estudiantes_curso_abierto.forEach(({ partner_vendedor, precio, moneda, comision_vendedor }) => {
            if (partner_vendedor && precio && moneda) {
                const isLssiVendor = partner_vendedor.toLowerCase().includes('lssi');
                if (!totalComissionByVendor[partner_vendedor]) {
                    totalComissionByVendor[partner_vendedor] = { 
                        totalPrecio: 0, 
                        moneda, 
                        lineitemcount: 0,
                        costoInstructores: 0,
                        totalComission: 0,
                        Calculated_profit_by_vendor: 0,
                    };
                }
                const vendorData = totalComissionByVendor[partner_vendedor];
                vendorData.totalPrecio += precio;
                vendorData.totalComission += isLssiVendor ? 0 : (precio * comision_vendedor / 100);
                vendorData.lineitemcount += 1;
                totalSalesByAllVendors += precio;
                totalLineItemCount += 1;
            }
        });
    
        if (totalSalesByAllVendors === 0 || totalLineItemCount === 0) {
            return { totalComissionByVendor, totalUtilidadByAllVendors };
        }
    
        Object.entries(totalComissionByVendor).forEach(([vendor, vendorData]) => {
            const isLssiVendor = vendor.toLowerCase().includes('lssi');
            if (isLssiVendor) {
                vendorData.totalComission = 0;
                vendorData.costoInstructores = 0;
                vendorData.costoPartidas = 0;
                vendorData.admin_total_cost = 0;
                vendorData.total_cost_proyect_con_causa = 0;
                vendorData.Calculated_profit_by_vendor = 0;
            } else {
                const { totalPrecio, lineitemcount } = vendorData;
                const proportion = totalPrecio / totalSalesByAllVendors;
                vendorData.proportion = proportion;
                vendorData.utilidad = proportion * 0.5 * utilidad_lssi;
                totalUtilidadByAllVendors += vendorData.utilidad;
    
                vendorData.costoInstructores = (totalCostoInstructores / totalLineItemCount) * lineitemcount;
                vendorData.costoPartidas = (partidaCosto / totalLineItemCount) * lineitemcount;
                vendorData.admin_total_cost = admin_total_cost * proportion;
                vendorData.total_cost_proyect_con_causa = total_cost_proyect_con_causa * proportion;
    
                vendorData.Calculated_profit_by_vendor = totalPrecio 
                    - vendorData.totalComission 
                    - vendorData.costoInstructores 
                    - vendorData.costoPartidas 
                    - vendorData.admin_total_cost 
                    - vendorData.total_cost_proyect_con_causa;
            }
        });
    
        return { totalComissionByVendor, totalUtilidadByAllVendors };
    };
    
    renderGroupedData = () => {
        const { utilities, totalCantidad } = this.props;
        return (
            <div>
                <h3>Utilidad por partners</h3>
                <br />
                <h4>Total de utilidades partners: {formatNumber ? formatNumber(totalCantidad) : totalCantidad}</h4>
                <Table responsive hover striped bordered>
                    <thead>
                        <tr className="table-danger">
                            <th>Recibe Utilidad</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilities.map((item, index) => (
                            <tr key={index}>
                                <td>{item.partner}</td>
                                <td>{formatNumber ? formatNumber(item.total_cantidad) : item.total_cantidad}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <hr />
            </div>
        );
    }
    
    calculateUtilidades() {
        const { filteredlider, utilidad } = this.props;
    
        let utilidad_lssi = 0;
        let utilidad_non_lssi = 0;
        let utilidad_non_lssi_name = '';
    
        if (filteredlider.length > 0) {
            const leader = filteredlider[0];
            utilidad_non_lssi_name = leader.lider;
            utilidad_non_lssi = (leader.utilidad / 100) * utilidad;
            utilidad_lssi = (1 - (leader.utilidad / 100)) * utilidad;
        } else {
            console.warn('filteredlider is empty');
        }
        
        return { utilidad_lssi, utilidad_non_lssi, utilidad_non_lssi_name };
    }
    
    generateCommissionTable = () => {
        const { totalComissionByVendor, totalUtilidadByAllVendors } = this.calculateComision();
    
        if (!totalComissionByVendor || Object.keys(totalComissionByVendor).length === 0) {
            return null;
        }
        return (
            <div>
                <h3>Utilidad por partner</h3>
                <Table responsive hover striped bordered>
                    <thead>
                        <tr className="table-danger">
                            <th>Recibe Utilidad</th>
                            <th>Numero de Estudiantes</th>
                            <th>Ingreso</th>
                            <th>Costo Instructores</th>
                            <th>Costo Partidas</th>
                            <th>Admin del Curso</th>
                            <th>Proyecto con Causa</th>
                            <th>Comission</th>
                            <th>Utilidad del Proyecto</th>
                            <th>Utilidad del Partner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(totalComissionByVendor).map(([
                            vendor, {
                                totalPrecio, 
                                lineitemcount,
                                costoInstructores,
                                costoPartidas,
                                admin_total_cost,
                                total_cost_proyect_con_causa,
                                totalComission,
                                Calculated_profit_by_vendor 
                            }
                        ]) => (
                            <tr key={vendor}>
                                <td>{vendor}</td>
                                <td>{lineitemcount}</td>
                                <td>{formatNumber(totalPrecio)}</td>
                                <td>{formatNumber(costoInstructores)}</td>
                                <td>{formatNumber(costoPartidas)}</td>
                                <td>{formatNumber(admin_total_cost)}</td>
                                <td>{formatNumber(total_cost_proyect_con_causa)}</td>
                                <td>{formatNumber(totalComission)}</td>
                                <td>{formatNumber(Calculated_profit_by_vendor)}</td>
                                <td>{formatNumber(Calculated_profit_by_vendor/2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Button 
                    color="success"
                    onClick={this.sendEmail}
                > 
                    Enviar correo a de Utilidad de Partners 
                </Button>
                <h3>Total utilidad por partners {formatNumber(totalUtilidadByAllVendors)}</h3>
            </div>
        );
    };
    
    sendEmail = async (e) => {
        e.preventDefault();
        const token = Cookies.get("token");
        const headers = { Authorization: `Token ${token}` }
    
        const abierto_miembros_uni = this.props.abierto_miembros.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.partner === value.partner
            ))
        );
    
        const { totalComissionByVendor } = this.calculateComision();
    
        try {
            const { proyectoNameSelected, proyectoCodeSelected, proyectoModalidadSelected, utilidad } = this.props;
    
            for (const [vendor, instructorData] of Object.entries(totalComissionByVendor)) {
                const emailParams = {
                    to_email: 'sanchez.salvador@gmail.com',
                    //to_email_Ber:'bgonzalez@leansixsigmainstitute.org',
                    //to_email_Luis: 'lsocconini@leansixsigmainstitute.org',
                    to_email_Ber:'sanchez.salvador@gmail.com',
                    to_email_Luis: 'sanchez.salvador@gmail.com',
                    to_email_miembro: abierto_miembros_uni.find(miembro => miembro.partner === vendor)?.email,
                    from_name: 'Bernardo Gonzalez',
                    to_name: vendor,
                    reply_to: 'bgonzalez@leansixsigmainstitute.org',
                    partner: vendor,
                    modalidad: proyectoModalidadSelected,
                    moneda: instructorData.moneda,
                    proyectoNameFrom: proyectoNameSelected,
                    estudiantes: instructorData.lineitemcount,
                    ingreso: formatNumber(instructorData.totalPrecio),
                    instructores: formatNumber(instructorData.costoInstructores),
                    partidas: formatNumber(instructorData.costoPartidas),
                    admin: formatNumber(instructorData.admin_total_cost),
                    causa: formatNumber(instructorData.total_cost_proyect_con_causa),
                    comission: formatNumber(instructorData.totalComission),
                    utilidad: formatNumber(instructorData.Calculated_profit_by_vendor/2 ),
                    utilidad_proyecto: formatNumber(utilidad),
                    proyecto_code: proyectoCodeSelected, 
                    link: `https://main.d30ns0xsf7zdez.amplifyapp.com/project/${proyectoCodeSelected}`
                };
    
                const dbParams = {
                    partner: vendor,
                    proyectoNameFrom: proyectoNameSelected,
                    estudiantes: instructorData.lineitemcount,
                    ingreso: instructorData.totalPrecio,
                    instructores: instructorData.costoInstructores,
                    partidas: instructorData.costoPartidas,
                    admin: instructorData.admin_total_cost,
                    causa: instructorData.total_cost_proyect_con_causa,
                    comission: instructorData.totalComission,
                    utilidad: instructorData.Calculated_profit_by_vendor/2,
                    utilidad_proyecto: utilidad,
                    proyecto_code: proyectoCodeSelected,
                    moneda: instructorData.moneda,
                };
    
                try {
                    await axios.post(API_URL_utilidad_partner_curso_abierto, dbParams, { headers });
                    console.log("Data was loaded successfully via POST");
                } catch (postError) {
                    console.error("POST request failed, attempting PUT request:", postError);
    
                    try {
                        await axios.put(`${API_URL_utilidad_partner_curso_abierto}?proyecto_code=${proyectoCodeSelected}&partner=${vendor}`, dbParams, { headers });
                        console.log('Data was updated successfully via PUT');
                        console.log('Data to send:', dbParams);
                        } catch (putError) {
                        console.error('PUT request also failed:', putError);
                        }
                        }

                        try {
                            await emailjs.send('service_orze3qe', 'template_yief1i1', emailParams, 'VBYWnQsgbxRBcGQ8N');
                            toast.success(`Email sent to ${vendor}`);
                        } catch (emailError) {
                            toast.error(`Failed to send email to ${vendor}`);
                        }
                    }
                } catch (error) {
                    toast.error("Failed to fetch data.");
                }
            };
            
            renderTableRows = (items, categoryClass) => {
                const { partners, percent, amount, honorarios } = this.state;
                return items.map((item, index) => (
                    <tr key={index} className={categoryClass}>
                        <td>{item.category}</td>
                        <td>{item.name}</td>
                        <td>
                            <Input
                                type="select"
                                name={item.name}
                                value={honorarios[item.name] || this.props.proyectoLider} 
                                onChange={this.onChange}
                            >
                                <option key='0' value="">{item.name}:</option>
                                {Array.isArray(partners) && partners.map(partner => (
                                    <option key={partner.pk} value={partner.partner}>
                                        {partner.partner}
                                    </option>
                                ))}
                            </Input>
                        </td>
                        <td>{percent[item.name].toFixed(2)}%</td>
                        <td>{amount[item.name]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ));
            }
            
            render() {
                const { proyectoModalidadSelected, instructoresProportions } = this.props;
                const { utilidad_lssi, utilidad_non_lssi, utilidad_non_lssi_name } = this.calculateUtilidades();
                const { totalUtilidadByAllVendors } = this.calculateComision();
                
                const preventaItems = [
                    { category: "Preventa", name: "contacto" },
                    { category: "Preventa", name: "cita" },
                ];
            
                const comercialItems = [
                    { category: "Comercial", name: "diagnostico" },
                    { category: "Comercial", name: "propuesta" },
                    { category: "Comercial", name: "cierre" },
                ];
            
                const postVentaItems = [
                    { category: "Post Venta", name: "kickoff" },
                    { category: "Post Venta", name: "seguimiento" },
                    { category: "Post Venta", name: "reunioncierre" },
                ];
            
                return (
                    <div>
                        {proyectoModalidadSelected && !proyectoModalidadSelected.includes('Abierto') && (
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
                                        {this.renderTableRows(preventaItems, "table-primary")}
                                        {this.renderTableRows(comercialItems, "table-success")}
                                        {this.renderTableRows(postVentaItems, "table-warning")}
                                        <tr key='10'>
                                            <td>Desarollo de Equipo</td>
                                            <td>Coaching/Lider</td>
                                            <td>{this.props.proyectoLider}</td>
                                            <td>{this.state.percent.coaching.toFixed(2)}%</td>
                                            <td>{formatNumber(this.state.amount.coaching)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        )}
            
                        {proyectoModalidadSelected && !proyectoModalidadSelected.includes('Abierto') && (
                            <div>
                                <hr />
                                <h3>Utilidad de Partner que Asigna</h3>                       
                                <Table responsive hover striped>
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
                                        {(!instructoresProportions || !Array.isArray(instructoresProportions) || instructoresProportions.length === 0) ? (
                                            <tr>
                                                <td colSpan="7" align="center">
                                                    <b>Ups, todavía no hay !!</b>
                                                </td>
                                            </tr>
                                        ) : (
                                            instructoresProportions.map((partner, index) => (
                                                <tr key={index}>
                                                    <td>Desarollo de Equipo</td>
                                                    <td>{partner.miembro_que_asigna}</td>
                                                    <td>{partner.instructor}</td>
                                                    <td>{(partner.proportion * 100).toFixed(2)}%</td>
                                                    <td>{(partner.proportion * 100 * 0.125).toFixed(2)}%</td>
                                                    <td>{formatNumber(partner.totalIncome)}</td>
                                                    <td>{partner.moneda}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                                <br />
                                <hr />
                                <br />
                                <Button color="primary" onClick={this.handleSubmit}>
                                    Guardar Datos
                                </Button>
                                <ToastContainer />
                                <br />
                            </div>
                        )}
            
                        <hr />
                        {proyectoModalidadSelected && !proyectoModalidadSelected.includes('Abierto') && (
                            <div>
                                {this.renderGroupedData()}
                            </div>
                        )}
                        {proyectoModalidadSelected && proyectoModalidadSelected.includes('Abierto') && (
                            <div>
                                {this.generateCommissionTable()}
                                <hr />
                            </div>
                        )}
                        <div>
                            <h2>Utilidad LSSI {formatNumber(utilidad_lssi - totalUtilidadByAllVendors)}</h2>
                            {utilidad_non_lssi_name && (
                                <h2>Utilidad {utilidad_non_lssi_name} {formatNumber(utilidad_non_lssi)}</h2>
                            )}
                        </div>
                    </div>
                );
            }
        }

        export default HonorariosList;

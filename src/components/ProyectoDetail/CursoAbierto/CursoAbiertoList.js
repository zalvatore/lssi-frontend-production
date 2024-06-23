import React, { Component } from "react";
import { Table, Input, FormGroup, Label, Col, Row } from "reactstrap";
import Moment from 'moment';
import CursoAbiertoModal from "./CursoAbiertoModal";
import CursoAbiertoRemovalModal from "./CursoAbiertoRemovalModal";

class CursoAbiertoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            searchQuery: "",
            filterNombre: "",
            filterPartner: "",
            filterVendedor: "",
            totalPrecioByVendedor: {},
            totalPrecioAllVendedores: 0,
            totalComisionByVendedor: {},
            totalComisionAllVendedores: 0,
            totalComisionByVendedorAndMoneda: {},
            adminCostPercentage: 0.1,
        };
    }

    handleAdminCostChange = (event) => {
        const newAdminCostPercentage = parseFloat(event.target.value) || 0;
        this.setState({ adminCostPercentage: newAdminCostPercentage }, () => {
            this.calculateTotalPrecios();
            this.calculateComision();
            this.calculateCostoAdmin();
        });
    };

    componentDidMount() {
        this.calculateTotalPrecios();
        this.calculateComision();
        this.calculateCostoAdmin();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.estudiantes_curso_abierto !== this.props.estudiantes_curso_abierto) {
            this.calculateTotalPrecios();
            this.calculateComision();
            this.calculateCostoAdmin();
        }
    }

    calculateComision = () => {
        const { estudiantes_curso_abierto } = this.props;
        if (estudiantes_curso_abierto && Array.isArray(estudiantes_curso_abierto)) {
            const totalComisionByVendedor = {};
            let totalComisionAllVendedores = 0;

            estudiantes_curso_abierto.forEach(estudiante => {
                const { miembro_vendedor, comision_vendedor, precio, moneda } = estudiante;
                if (miembro_vendedor && comision_vendedor !== null && precio !== null && moneda) {
                    if (!totalComisionByVendedor[miembro_vendedor]) {
                        totalComisionByVendedor[miembro_vendedor] = {
                            totalPrecio: 0,
                            totalComision: 0,
                            moneda: moneda
                        };
                    }
                    totalComisionByVendedor[miembro_vendedor].totalPrecio += precio;
                    totalComisionByVendedor[miembro_vendedor].totalComision += (precio * comision_vendedor / 100);
                }
            });
            totalComisionAllVendedores = Object.values(totalComisionByVendedor).reduce((acc, vendor) => acc + vendor.totalComision, 0);

            this.setState({ totalComisionByVendedor, totalComisionAllVendedores });
        }
    };

    calculateCostoAdmin = () => {
        const { estudiantes_curso_abierto } = this.props;
        const { adminCostPercentage } = this.state;
        if (estudiantes_curso_abierto && Array.isArray(estudiantes_curso_abierto)) {
            const totalCostoAdminPorPartner = {};
            let totalCostoAdmin = 0;

            estudiantes_curso_abierto.forEach(estudiante => {
                const { partner_vendedor, precio, moneda } = estudiante;
                if (partner_vendedor && precio !== null && moneda) {
                    if (!totalCostoAdminPorPartner[partner_vendedor]) {
                        totalCostoAdminPorPartner[partner_vendedor] = {
                            totalCosto: 0,
                            moneda: moneda
                        };
                    }
                    totalCostoAdminPorPartner[partner_vendedor].totalCosto += precio * adminCostPercentage;
                }
            });
            totalCostoAdmin = Object.values(totalCostoAdminPorPartner).reduce((acc, vendor) => acc + vendor.totalCosto, 0);

            this.setState({ totalCostoAdminPorPartner, totalCostoAdmin });
        }
    };

    calculateTotalPrecios = () => {
        const { estudiantes_curso_abierto } = this.props;
        if (estudiantes_curso_abierto && Array.isArray(estudiantes_curso_abierto)) {
            const totalPrecioByVendedor = {};
            let totalPrecioAllVendedores = 0;

            estudiantes_curso_abierto.forEach(estudiante => {
                const { miembro_vendedor, precio } = estudiante;
                if (miembro_vendedor && precio !== null) {
                    totalPrecioByVendedor[miembro_vendedor] = (totalPrecioByVendedor[miembro_vendedor] || 0) + precio;
                }
            });
            totalPrecioAllVendedores = Object.values(totalPrecioByVendedor).reduce((acc, precio) => acc + (precio || 0), 0);
            this.setState({ totalPrecioByVendedor, totalPrecioAllVendedores });
        }
    };

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    filterEstudiantes = (estudiantes) => {
        const { filterNombre, filterPartner, filterVendedor } = this.state;
        return estudiantes.filter(estudiante => {
            return (
                estudiante.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) &&
                estudiante.partner_vendedor?.toLowerCase().includes(filterPartner.toLowerCase()) &&
                estudiante.miembro_vendedor?.toLowerCase().includes(filterVendedor.toLowerCase())
            );
        });
    };

    formatCurrency = (value) => {
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    calculateTotalPrecioFiltered = (filteredEstudiantes) => {
        return filteredEstudiantes.reduce((acc, estudiante) => acc + (estudiante.precio || 0), 0);
    };

    render() {
        const { estudiantes_curso_abierto } = this.props;
        const {
            totalComisionAllVendedores,
            totalComisionByVendedor,
            filterNombre,
            filterPartner,
            filterVendedor,
        } = this.state;

        const filteredEstudiantes = estudiantes_curso_abierto ? this.filterEstudiantes(estudiantes_curso_abierto) : [];
        const sortedEstudiantes = filteredEstudiantes.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
        const totalPrecioFiltered = this.calculateTotalPrecioFiltered(filteredEstudiantes);
        const totalEstudiantesFiltered = filteredEstudiantes.length;

        return (
            <div>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="filterNombre">Filtro por estudiante:</Label>
                            <Input
                                type="text"
                                name="filterNombre"
                                id="filterNombre"
                                value={filterNombre}
                                onChange={this.handleFilterChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="filterPartner">Filtro por Partner:</Label>
                            <Input
                                type="text"
                                name="filterPartner"
                                id="filterPartner"
                                value={filterPartner}
                                onChange={this.handleFilterChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="filterVendedor">Filtro por Vendedor:</Label>
                            <Input
                                type="text"
                                name="filterVendedor"
                                id="filterVendedor"
                                value={filterVendedor}
                                onChange={this.handleFilterChange}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <div style={{ marginTop: "20px" }}>
                    <h4>Total comision de vendedores: {this.formatCurrency(totalComisionAllVendedores)}</h4>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <h4>Total precio filtrado: {this.formatCurrency(totalPrecioFiltered)}</h4>
                    <h4>Total estudiantes filtrados: {totalEstudiantesFiltered}</h4>
                </div>
                <Table responsive hover striped bordered>
                    <thead>
                        <tr className="table-danger">
                            <th>Nombre</th>
                            <th>Partner</th>
                            <th>Vendedor</th>
                            <th>Comision</th>
                            <th>Correo</th>
                            <th>Telefono</th>
                            <th>Precio</th>
                            <th>Moneda</th>
                            <th>Referencia</th>
                            <th>Fecha de Registro</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {!sortedEstudiantes || sortedEstudiantes.length <= 0 ? (
                            <tr>
                                <td colSpan="15" align="center">
                                    <b>Ups, todavia no hay partidas!!</b>
                                </td>
                            </tr>
                        ) : (
                            sortedEstudiantes.map(estudiante => (
                                <tr key={estudiante.pk}>
                                    <td>{estudiante.nombre}</td>
                                    <td>{estudiante.partner_vendedor}</td>
                                    <td>{estudiante.miembro_vendedor}</td>
                                    <td>{estudiante.comision_vendedor}%</td>
                                    <td>{estudiante.correo}</td>
                                    <td>{estudiante.telefono}</td>
                                    <td>{this.formatCurrency(estudiante.precio)}</td>
                                    <td>{estudiante.moneda}</td>
                                    <td>{estudiante.referencia}</td>
                                    <td>{Moment(estudiante.registration_date).format('MMM/DD/yy')}</td>
                                    <td align="center">
                                        <CursoAbiertoModal
                                            create={false}
                                            estudiante={estudiante}
                                            resetState={this.props.resetState}
                                        />
                                        &nbsp;&nbsp;
                                        <CursoAbiertoRemovalModal
                                            pk={estudiante.pk}
                                            resetState={this.props.resetState}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
                
                <div>
                    <Table responsive hover striped bordered>
                        <thead>
                            <tr className="table-danger">
                                <th>Vendedor</th>
                                <th>Comision</th>
                                <th>Total Venta</th>
                                <th>Moneda</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalComisionByVendedor && Object.entries(totalComisionByVendedor).map(([vendedor, comision]) => (
                                <tr key={vendedor}>
                                    <td>{vendedor}</td>
                                    <td>$ {this.formatCurrency(comision.totalComision)}</td>
                                    <td>$ {this.formatCurrency(comision.totalPrecio)}</td>
                                    <td>{comision.moneda}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default CursoAbiertoList;

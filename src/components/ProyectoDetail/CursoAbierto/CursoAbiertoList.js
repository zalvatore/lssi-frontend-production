import React, { Component } from "react";
import FilterForm from "./FilterForm";
import EstudiantesTable from "./EstudiantesTable";
import ComisionSummary from "./ComisionSummary";
import { calculateComision, calculateCostoAdmin, calculateTotalPrecios } from "./calculations";
import { toast } from "react-toastify";
import { Col, Row, Button } from "reactstrap";
import Cookies from "js-cookie";
import Papa from 'papaparse';
import axios from "axios";
import { API_URL_partidas_curso_abierto } from "../../../constants";

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

    componentDidMount() {
        this.calculateTotals();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.estudiantes_curso_abierto !== this.props.estudiantes_curso_abierto) {
            this.calculateTotals();
        }
    }

    calculateTotals = () => {
        this.calculateTotalPrecios();
        this.calculateComision();
        this.calculateCostoAdmin();
    };

    handleAdminCostChange = (event) => {
        const newAdminCostPercentage = parseFloat(event.target.value) || 0;
        this.setState({ adminCostPercentage: newAdminCostPercentage }, this.calculateTotals);
    };

    calculateComision = () => {
        const { estudiantes_curso_abierto } = this.props;
        const { totalComisionByVendedor, totalComisionAllVendedores } = calculateComision(estudiantes_curso_abierto);
        this.setState({ totalComisionByVendedor, totalComisionAllVendedores });
    };

    calculateCostoAdmin = () => {
        const { estudiantes_curso_abierto } = this.props;
        const { adminCostPercentage } = this.state;
        const { totalCostoAdminPorPartner, totalCostoAdmin } = calculateCostoAdmin(estudiantes_curso_abierto, adminCostPercentage);
        this.setState({ totalCostoAdminPorPartner, totalCostoAdmin });
    };

    calculateTotalPrecios = () => {
        const { estudiantes_curso_abierto } = this.props;
        const { totalPrecioByVendedor, totalPrecioAllVendedores } = calculateTotalPrecios(estudiantes_curso_abierto);
        this.setState({ totalPrecioByVendedor, totalPrecioAllVendedores });
    };

    handleFilterChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    filterEstudiantes = (estudiantes) => {
        const { filterNombre, filterPartner, filterVendedor } = this.state;
        return estudiantes.filter(estudiante => (
            estudiante.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) &&
            estudiante.partner_vendedor?.toLowerCase().includes(filterPartner.toLowerCase()) &&
            estudiante.miembro_vendedor?.toLowerCase().includes(filterVendedor.toLowerCase())
        ));
    };

    formatCurrency = (value) => {
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    calculateTotalPrecioFiltered = (filteredEstudiantes) => {
        return filteredEstudiantes.reduce((acc, estudiante) => acc + (estudiante.precio || 0), 0);
    };

    downloadCSV = () => {
        const { estudiantes_curso_abierto } = this.props
        console.log(estudiantes_curso_abierto);
        const csvHeader = "Proyecto Code, Nombre, Miembro Vendedor, Partner Vendedor, Comision Vendedor, Correo, Telefono, Precio, Moneda";

        const csvRows = estudiantes_curso_abierto.map(estudiante =>
          [
            estudiante.proyecto_code,
            estudiante.nombre,
            estudiante.miembro_vendedor,
            estudiante.partner_vendedor,
            estudiante.comision_vendedor,
            estudiante.correo,
            estudiante.telefono,
            estudiante.precio,
            estudiante.moneda,
          ].join(',')
        );
    
        const csvData = [csvHeader, ...csvRows].join('\n');
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-16le;' });
        const url = URL.createObjectURL(blob);
    
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10); // Format YYYY-MM-DD
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Estudiantes_${dateStr}.csv`); // Appends today's date to the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    handleFileUpload = () => {
      const { file } = this.state;
      if (!file) {
          alert('No file selected!');
          return;
      }
    
      const reader = new FileReader();
    
      // Called when the file reading has completed successfully
      reader.onload = (event) => {
          Papa.parse(event.target.result, {
              header: true,
              skipEmptyLines: true,
              complete: this.updateDatabase
          });
      };
    
      // Called if there is an error reading the file (e.g., file is not accessible, or reading is interrupted)
      reader.onerror = (event) => {
          console.error('Error reading file:', reader.error);
          alert('Failed to read the file. Please try again or check if the file is corrupted.');
          toast.error("Failed to read the file. Please try again or check if the file is corrupted.");
      };
    
      // Called if the reading operation is aborted (e.g., through calling reader.abort())
      reader.onabort = (event) => {
          console.warn('File reading was aborted.');
          alert('File reading was aborted by the user or the browser.');
          toast.error("File reading was aborted by the user or the browser.");
      };
    
      // Start reading the file as Text
      reader.readAsText(file);
    };
    
    
    updateDatabase = async (result) => {
        const data = result.data.map(item => ({
            ...item,
            grupo: item.grupo || 'Default Value',  // Ensure 'grupo' is not empty, provide a default if necessary
            proyecto_code: this.props.proyectoCodeSelected || 'Default Value',  // Ensure 'proyecto_code' is not empty, provide a default if necessary

        }));
        const token = Cookies.get("token");
        const headers = { Authorization: `Token ${token}` };
        try {
            for (const entry of data) {
                await axios.post(API_URL_partidas_curso_abierto, entry, { headers });
                toast.success("Data has been updated successfully.");
            }
            this.resetState(); // Refresh the data in your application if necessary
        } catch (error) {
            toast.error("Failed to update database. Please try again.");
            console.error('Error updating database:', error);
    
            // Improved error handling
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.partner && Array.isArray(errorData.partner) && errorData.partner.length > 0) {
                    console.error('Error details:', errorData.partner[0]);
                } else {
                    console.error('Unexpected error response structure:', errorData);
                }
            } else {
                console.error('No response data available in the error object');
            }
        }
    };
    
    
    handleFileChange = (event) => {
      this.setState({ file: event.target.files[0] });
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
        console.log('sortedEstudiantes',sortedEstudiantes);
        const totalPrecioFiltered = this.calculateTotalPrecioFiltered(filteredEstudiantes);
        const totalEstudiantesFiltered = filteredEstudiantes.length;

        return (
            <div>
                <br></br>
                <Row>
                    <Col>
                    <Button style={{ backgroundColor: '#ADD8E6', color: 'black' }} onClick={this.downloadCSV}>Descarga Estudiantes a CSV</Button>
                    </Col>
                    <Col>
                    <div>
                    <input type="file" accept=".csv" onChange={this.handleFileChange} />
                    <button onClick={this.handleFileUpload}>Upload CSV</button>
                </div>  
                </Col>  
                </Row>
                <br></br>
                <FilterForm
                    filterNombre={filterNombre}
                    filterPartner={filterPartner}
                    filterVendedor={filterVendedor}
                    handleFilterChange={this.handleFilterChange}
                />
                <div style={{ marginTop: "20px" }}>
                    <h4>Total comision de vendedores: {this.formatCurrency(totalComisionAllVendedores)}</h4>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <h4>Total precio filtrado: {this.formatCurrency(totalPrecioFiltered)}</h4>
                    <h4>Total estudiantes filtrados: {totalEstudiantesFiltered}</h4>
                </div>
                <EstudiantesTable
                    estudiantes={sortedEstudiantes}
                    formatCurrency={this.formatCurrency}
                    resetState={this.props.resetState}
                />
                <ComisionSummary
                    totalComisionByVendedor={totalComisionByVendedor}
                    formatCurrency={this.formatCurrency}
                />
            </div>
        );
    }
}

export default CursoAbiertoList;
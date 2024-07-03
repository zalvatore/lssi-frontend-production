import React, { Component } from "react";
import { Col, Container, Row, Button } from "reactstrap";
import PartnerList from "../components/Partner/PartnerList";
import NewPartnerModal from "../components/Partner/NewPartnerModal";
import axios from "axios";
import { API_URL_partners } from "../constants";
import Cookies from "js-cookie";
import Moment from 'moment';
import Papa from 'papaparse';
import {formatDate} from "../components/utils";
import { ToastContainer, toast } from "react-toastify";

class Partners extends Component {
  state = {
    partners: [],
    error: null // Added to track potential errors from API requests
  };

  componentDidMount() {
    this.resetState();
  }

  getpartners = async () => {
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };
    try {
      const response = await axios.get(API_URL_partners, { headers });
      this.setState({ partners: response.data });
    } catch (error) {
      console.error("Failed to fetch partners:", error);
      this.setState({ error: error.response ? error.response.data : "Failed to fetch partners" });
      toast.error("Failed to fetch partners. Please refresh the page to try again.");
    }
  };
  

  resetState = () => {
    this.getpartners();
  };

  downloadCSV = () => {
    const { partners } = this.state; 
    const csvHeader = "Codigo de Miembro, Miembro, Nivel, Correo de Miembro, Value Stream, Localizacion, IVA, Retencion IVA, Retencion ISR/IRPF, Fecha de Ingreso, Fecha de Cumpleaños, Fecha de Registro\n";
    const csvRows = partners.map(partner =>
      [
        partner.partner_code,
        partner.partner,
        partner.nivel,
        partner.email,
        partner.grupo,
        partner.localizacion,
        partner.iva,
        partner.retencion,
        partner.isr,
        Moment(partner.ingreso_date).format('YYYY-MM-DD'),
        Moment(partner.cumple_date).format('YYYY-MM-DD'),
        Moment(partner.registration_date).format('YYYY-MM-DD')
      ].join(',')
    );

    const csvData = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-16le;' });
    const url = URL.createObjectURL(blob);

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10); // Format YYYY-MM-DD

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Equipo_${dateStr}.csv`); // Appends today's date to the filename
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
      cumple_date: formatDate(item.cumple_date),
      ingreso_date: formatDate(item.ingreso_date),
      grupo: item.grupo || 'Default Value'  // Ensure 'grupo' is not empty, provide a default if necessary
  }));
  const token = Cookies.get("token");
  const headers = { Authorization: `Token ${token}` };
  try {
      for (const entry of data) {
          await axios.post(API_URL_partners, entry, { headers });
          toast.success("Data has been updated successfully.");
      }
      this.resetState(); // Refresh the data in your application if necessary
  } catch (error) {
      toast.error("Failed to update database. Please try again.");
      console.error('Error updating database:', error.response.data.partner[0]
    );

      
  }
};


handleFileChange = (event) => {
  this.setState({ file: event.target.files[0] });
};


  render() {
    return (
      <Container style={{ marginTop: "20px" }}>
        <h1>Equipo</h1>
        <Row>
          <Col>
            <Button style={{ backgroundColor: '#ADD8E6', color: 'black' }} onClick={this.downloadCSV}>Descarga Equipo a CSV</Button>
          </Col>
          <Col>
          <div>
          <input type="file" accept=".csv" onChange={this.handleFileChange} />
          <button onClick={this.handleFileUpload}>Upload CSV</button>
        </div>  
        </Col>  
        </Row>
        <hr></hr>
        <Row>
          <Col>
            <PartnerList
              partners={this.state.partners}
              resetState={this.resetState}
              itemsPerPage={8}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <NewPartnerModal create={true} resetState={this.resetState} />
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    );
  }
}

export default Partners;

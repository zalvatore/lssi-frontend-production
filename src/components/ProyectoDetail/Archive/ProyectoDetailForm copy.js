import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label, Alert } from "reactstrap";
import axios from "axios";

class ConsultantForm extends React.Component {

    state = {
        pk: 0,
        proyecto_code: "",
        name: "",
        inicio_date: "",
        terminacion_date: "",
        horas: "",
        traifa_hora: "",
        moneda: "",
        errorMessage: '',
        errorMessageFecha:''
      };
    
      componentDidMount() {
        if (this.props.proyecto) {
          const { 
          pk, 
          proyecto_code,
          name,
          inicio_date,
          terminacion_date,
          horas,
          traifa_hora,
          moneda,
          } = this.props.proyecto;
    
          const formattedInicioDate = inicio_date ? new Date(inicio_date) : null;
          const formattedTerminacionDate = terminacion_date ? new Date(terminacion_date) : null;
    
          this.setState({ 
            pk, 
            proyecto_code,
            name,
            inicio_date: formattedInicioDate,
            terminacion_date: formattedTerminacionDate,
            horas,
            traifa_hora,
            moneda,
          });
        }
      }


  const [selectedProject] = useState("");
  const [consultantName, setConsultantName] = useState("");
  const [hourlyCost, setHourlyCost] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleConsultantNameChange = (event) => {
    setConsultantName(event.target.value);
  };

  const handleHourlyCostChange = (event) => {
    setHourlyCost(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a new consultant object
    const newConsultant = {
      project: selectedProject,
      name: consultantName,
      hourlyCost: hourlyCost
    };

    // Send the new consultant data to the API using axios
    axios.post("API_URL", newConsultant)
      .then(response => {
        setSuccessMessage("Consultant added successfully.");
        setConsultantName("");
        setHourlyCost("");
      })
      .catch(error => {
        setErrorMessage("Error adding consultant.");
        console.error("Error adding consultant:", error);
      });
  };

  return (
    <div>
      <h2>Add Consultant</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="consultantName">Consultant Name:</Label>
          <Input type="text" id="consultantName" value={consultantName} onChange={handleConsultantNameChange} />
        </FormGroup>
        <FormGroup>
          <Label for="hourlyCost">Hourly Cost:</Label>
          <Input type="text" id="hourlyCost" value={hourlyCost} onChange={handleHourlyCostChange} />
        </FormGroup>
        <Button type="submit">Add Consultant</Button>
      </Form>
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
    </div>
  );
}

export default ConsultantForm;

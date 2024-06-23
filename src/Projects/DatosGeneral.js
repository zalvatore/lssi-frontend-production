import React from 'react';
import { Col, Container, Row, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const GeneralData = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const { 
    inicio_date, lider, modalidad, moneda, name, 
    producto, proyecto_code, registration_date, status, 
    terminacion_date 
  } = data[0];

  return (
    <Container className="mt-4 p-4 border rounded shadow-sm">
        <h1>Datos del Proyecto</h1>
        <hr />  
        {name && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Nombre:</Label></Col>
          <Col xs="8">{name}</Col>
        </Row>
      )}
      {proyecto_code && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Codigo de Proyecto:</Label></Col>
          <Col xs="8">{proyecto_code}</Col>
        </Row>
      )}
      {lider && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Lider:</Label></Col>
          <Col xs="8">{lider}</Col>
        </Row>
      )}
      {status && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Status:</Label></Col>
          <Col xs="8" style={{ color: status === 'Activo' ? 'green' : 'inherit' }}>{status}</Col>
        </Row>
      )}
      {modalidad && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Modalidad:</Label></Col>
          <Col xs="8">{modalidad}</Col>
        </Row>
      )}
      {moneda && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Moneda:</Label></Col>
          <Col xs="8">{moneda}</Col>
        </Row>
      )}
      
      {producto && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Producto:</Label></Col>
          <Col xs="8">{producto}</Col>
        </Row>
      )}
      
      {registration_date && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Fecha de Registro:</Label></Col>
          <Col xs="8">{new Date(registration_date).toLocaleDateString()}</Col>
        </Row>
      )}
      {inicio_date && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Fecha de Inicio:</Label></Col>
          <Col xs="8">{new Date(inicio_date).toLocaleDateString()}</Col>
        </Row>
      )}
      {terminacion_date && (
        <Row className="mb-3">
          <Col xs="4"><Label className="font-weight-bold">Fecha de Terminacion:</Label></Col>
          <Col xs="8">{new Date(terminacion_date).toLocaleDateString()}</Col>
        </Row>
      )}
      
    </Container>
  );
};

export default GeneralData;
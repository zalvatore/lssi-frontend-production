import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import { formatNumber } from '../components/utils';

const EstudianteTable = ({ projectData }) => {
  if (!projectData || projectData.length <= 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="9" align="center">
            <b>Ups, todavia no hay estudiantes!!</b>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {projectData.map((estudiante) => (
        <tr key={estudiante.pk}>
          <td>{estudiante.nombre}</td>
          <td>{estudiante.partner_vendedor}</td>
          <td>{estudiante.miembro_vendedor}</td>
          <td>{estudiante.comision_vendedor}%</td>
          <td>{estudiante.correo}</td>
          <td>{estudiante.telefono}</td>
          <td>{formatNumber(estudiante.precio)}</td>
          <td>{estudiante.moneda}</td>
          <td>{estudiante.referencia}</td>
        </tr>
      ))}
    </tbody>
  );
};

const EstudianteComponent = ({ projectData, onTotalsCalculated }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [totalComision, setTotalComision] = useState(0);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let totalPrecio = 0;
    let totalComision = 0;

    if (projectData && projectData.length > 0) {
      projectData.forEach((estudiante) => {
        totalPrecio += estudiante.precio;
        totalComision += (estudiante.precio * estudiante.comision_vendedor) / 100;
      });
    }

    setTotalPrecio(totalPrecio);
    setTotalComision(totalComision);

    if (onTotalsCalculated) {
      onTotalsCalculated({ totalPrecio, totalComision });
    }
  }, [projectData, onTotalsCalculated]);

  return (
    <>
      <Button color="primary" onClick={toggleCollapse}>
        {isCollapsed ? 'Ver detalle' : 'Cerrar detalle'}
      </Button>
      {!isCollapsed && (
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
            </tr>
          </thead>
          <EstudianteTable projectData={projectData} />
        </Table>
      )}
      {projectData && projectData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4><b>Total Ingreso:</b> {formatNumber(totalPrecio)}</h4>
          <h4><b>Total Comision:</b> {formatNumber(totalComision)}</h4>
          <hr />
        </div>
      )}
    </>
  );
};

export default EstudianteComponent;
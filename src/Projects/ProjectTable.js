import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import ProjectTableRow from './ProjectTableRow';
import { formatNumber } from '../components/utils'; // Import formatNumber

const ProjectTable = ({ projectData }) => {
  if (!projectData || projectData.length <= 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="10" align="center">
            <b>Ups, todavia no hay instructores!!</b>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {projectData.map((instructor) => (
        <ProjectTableRow key={instructor.pk} instructor={instructor} />
      ))}
    </tbody>
  );
};

const TableComponent = ({ projectData, onTotalsCalculated }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totals, setTotals] = useState({ totalIngreso: 0, totalCosto: 0 });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let totalIngreso = 0;
    let totalCosto = 0;

    if (projectData && projectData.length > 0) {
      projectData.forEach((instructor) => {
        const ingreso = instructor.horas * instructor.traifa_hora * instructor.semanas;
        const costo = instructor.horas * instructor.costo_hora * instructor.semanas;
        totalIngreso += ingreso;
        totalCosto += costo;
      });
    }

    setTotals({ totalIngreso, totalCosto });

    if (onTotalsCalculated) {
      onTotalsCalculated({ totalIngreso, totalCosto });
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
              <th>Instructor</th>
              <th>Partner que Asigna</th>
              <th>Horas x Semana</th>
              <th>Precio x Hora</th>
              <th>Costo x Hora</th>
              <th>Moneda</th>
              <th>Numero de Semanas</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <ProjectTable projectData={projectData} />
        </Table>
      )}
      {projectData && projectData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4><b>Total Ingreso Instructores:</b> {formatNumber(totals.totalIngreso)}</h4>
          <h4><b>Total Costo Instructores:</b> {formatNumber(totals.totalCosto)}</h4>
          <hr />
        </div>
      )}
    </>
  );
};

export default TableComponent;
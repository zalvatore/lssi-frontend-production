import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import { formatNumber } from '../components/utils';

const UtilidadAbiertaTable = ({ projectData }) => {
  if (!projectData || projectData.length <= 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="9" align="center">
            <b>Ups, todavia no hay Data!!</b>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {projectData.map((DataRow) => (
        <tr key={DataRow.pk}>
          <td>{DataRow.partner}</td>
          <td>{DataRow.estudiantes}</td>
          <td>{formatNumber(DataRow.ingreso)}</td>
          <td>{formatNumber(DataRow.instructores)}</td>
          <td>{formatNumber(DataRow.partidas)}</td>
          <td>{formatNumber(DataRow.admin)}</td>
          <td>{formatNumber(DataRow.causa)}</td>
          <td>{formatNumber(DataRow.comission)}</td>
          <td>{formatNumber(DataRow.utilidad)}</td>
        </tr>
      ))}
    </tbody>
  );
};

const UtilidadAbiertaComponent = ({ projectData, onTotalsCalculated }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totalUtilidad, setTotalUtilidad] = useState(0);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let total = 0;

    if (projectData && projectData.length > 0) {
      projectData.forEach((partida) => {
        total += partida.utilidad;
      });
    }

    setTotalUtilidad(total);

    if (onTotalsCalculated) {
      onTotalsCalculated({ totalUtilidad: total });
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
              <th>Recibe Utilidad</th>
              <th>Numero de Estudiantes</th>
              <th>Ingreso</th>
              <th>Costo Instructores</th>
              <th>Costo Partidas</th>
              <th>Admin del Curso</th>
              <th>Proyecto con Causa</th>
              <th>Comission</th>
              <th>Utilidad</th>
            </tr>
          </thead>
          <UtilidadAbiertaTable projectData={projectData} />
        </Table>
      )}
      <div style={{ marginTop: '20px' }}>
        <h4><b>Total Utilidad:</b> {formatNumber(totalUtilidad)}</h4>
        <hr></hr>
      </div>
    </>
  );
};

export default UtilidadAbiertaComponent;
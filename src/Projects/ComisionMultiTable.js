import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import { formatNumber } from '../components/utils';

const ComisionMultiTable = ({ projectData }) => {
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
          <td>{DataRow.instructor}</td>
          <td>{DataRow.pago_por}</td>
          <td>{formatNumber(DataRow.cantidad)}</td>
        </tr>
      ))}
    </tbody>
  );
};

const ComisionMultiComponent = ({ projectData, onTotalsCalculated }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totalCantidad, setTotalCantidad] = useState(0);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let total = 0;

    if (projectData && projectData.length > 0) {
      projectData.forEach((partida) => {
        total += partida.cantidad;
      });
    }

    setTotalCantidad(total);

    if (onTotalsCalculated) {
      onTotalsCalculated({ totalCantidad: total });
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
              <th>Pago a</th>
              <th>Pago Por</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <ComisionMultiTable projectData={projectData} />
        </Table>
      )}
      {projectData && projectData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4><b>Total de otros Costos:</b> {formatNumber(totalCantidad)}</h4>
          <hr />
        </div>
      )}
    </>
  );
};

export default ComisionMultiComponent;
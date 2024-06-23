import React, { useState, useEffect } from 'react';
import { Table, Button } from 'reactstrap';
import { formatNumber } from '../components/utils';

const PartidaTable = ({ projectData }) => {
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
      {projectData.map((partida) => (
        <tr key={partida.pk}>
          <td>{partida.partida}</td>
          <td>{partida.producto}</td>
          <td>{formatNumber(partida.precio)}</td>
          <td>{formatNumber(partida.costo)}</td>
          <td>{formatNumber(partida.cantidad)}</td>
          <td>{formatNumber(partida.totalPrice)}</td>
          <td>{formatNumber(partida.totalCost)}</td>
          <td>{partida.moneda}</td>
          <td>{partida.referencia}</td>
        </tr>
      ))}
    </tbody>
  );
};

const PartidaComponent = ({ projectData, onTotalsCalculated }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [totals, setTotals] = useState({ totalPrecio: 0, totalPartidaCosto: 0 });

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    let totalPrecio = 0;
    let totalPartidaCosto = 0;

    if (projectData && projectData.length > 0) {
      projectData.forEach((partida) => {
        totalPrecio += partida.totalPrice;
        totalPartidaCosto += partida.totalCost;
      });
    }

    setTotals({ totalPrecio, totalPartidaCosto });

    if (onTotalsCalculated) {
      onTotalsCalculated({ totalPrecio, totalPartidaCosto });
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
              <th>Partida</th>
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th>Costo Unitario</th>
              <th>Cantidad</th>
              <th>Precio Total</th>
              <th>Costo Total</th>
              <th>Moneda</th>
              <th>Referencia</th>
            </tr>
          </thead>
          <PartidaTable projectData={projectData} />
        </Table>
      )}
      {projectData && projectData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4><b>Total Precio:</b> {formatNumber(totals.totalPrecio)}</h4>
          <h4><b>Total Costo:</b> {formatNumber(totals.totalPartidaCosto)}</h4>
          <hr />
        </div>
      )}
    </>
  );
};

export default PartidaComponent;
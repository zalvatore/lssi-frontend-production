import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TableComponent from './ProjectTable';
import EstudianteComponent from './EstudianteTable';  
import PartidaComponent from './PartidaTable';
import GeneralData from './DatosGeneral';
import UtilidadAbiertaComponent from './UtilidadAbiertaTable';
import ComisionMultiComponent from './ComisionMultiTable';
import useFetchProjectData from './useFetchProjectData';
import { formatNumber } from '../components/utils'; 

function Project() {
  const { projectNumber } = useParams();
  const { data, loading, error } = useFetchProjectData(projectNumber);
  const [totals, setTotals] = useState({
    totalIngreso: 0,
    totalCosto: 0,
    totalPrecio: 0,
    totalPartidaCosto: 0,
    totalEstudiantePrecio: 0,
    totalComisionCantidad: 0,
    totalUtilidad: 0,
    totalComision: 0,
  });

  const handleTableTotalsCalculated = ({ totalIngreso, totalCosto }) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      totalIngreso,
      totalCosto,
    }));
  };

  const handlePartidaTotalsCalculated = ({ totalPrecio, totalPartidaCosto }) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      totalPrecio,
      totalPartidaCosto,
    }));
  };

  const handleEstudianteTotalsCalculated = ({ totalPrecio, totalComision }) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      totalEstudiantePrecio: totalPrecio,
      totalComision,
    }));
  };

  const handleComisionTotalsCalculated = ({ totalCantidad }) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      totalComisionCantidad: totalCantidad,
    }));
  };

  const handleUtilidadTotalsCalculated = ({ totalUtilidad }) => {
    setTotals((prevTotals) => ({
      ...prevTotals,
      totalUtilidad,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error loading the data. Please try again later.</div>;
  }

  const {
    projectData, 
    estudianteData, 
    partidaData, 
    generalData, 
    utilidadAbiertaData,
    comisionMultiData,
  } = data;

  // Calculate Total Ingresos and Total Costos
  const totalIngresos = totals.totalIngreso + totals.totalEstudiantePrecio + totals.totalPrecio;
  const totalCostos = totals.totalCosto + totals.totalPartidaCosto + totals.totalComisionCantidad + totals.totalComision;

  // Calculate Percentages
  const ingresoInstructoresPercentage = ((totals.totalIngreso / totalIngresos) * 100).toFixed(2);
  const ingresoEstudiantesPercentage = ((totals.totalEstudiantePrecio / totalIngresos) * 100).toFixed(2);
  const ingresoPartidasPercentage = ((totals.totalPrecio / totalIngresos) * 100).toFixed(2);
  const costoInstructoresPercentage = ((totals.totalCosto / totalIngresos) * 100).toFixed(2);
  const costoPartidasPercentage = ((totals.totalPartidaCosto / totalIngresos) * 100).toFixed(2);
  const otrosCostosPercentage = ((totals.totalComisionCantidad / totalIngresos) * 100).toFixed(2);
  const totalComisionPercentage  = ((totals.totalComision / totalIngresos) * 100).toFixed(2);

  // Calculate Utilidad Percentage
  const utilidadPercentage = ((totals.totalUtilidad / totalIngresos) * 100).toFixed(2);

  // Calculate Total Ingresos and Total Costos Percentages
  const totalIngresosPercentage = totalIngresos !== 0 ? ((totalIngresos / totalIngresos) * 100).toFixed(2) : 0;
  const totalCostosPercentage = totalCostos !== 0 ? ((totalCostos / totalIngresos) * 100).toFixed(2) : 0;

  return (
    <div>
      <GeneralData data={generalData} /> 
      <div style={{ marginTop: '20px' }}>
        <h4><b>Total Ingresos:</b> {formatNumber(totalIngresos)} ({totalIngresosPercentage}%)</h4>
        <h4><b>Total Costos:</b> {formatNumber(totalCostos)} ({totalCostosPercentage}%)</h4>
        <h4><b>Total Utilidad:</b> {formatNumber(totalIngresos-totalCostos)} ({totalIngresosPercentage-totalCostosPercentage}%)</h4>
        <hr></hr>
        <h4><b>Ingreso Instructores:</b> {formatNumber(totals.totalIngreso)} ({ingresoInstructoresPercentage}%)</h4>
        <h4><b>Ingreso Estudiantes:</b> {formatNumber(totals.totalEstudiantePrecio)} ({ingresoEstudiantesPercentage}%)</h4>
        <h4><b>Ingreso Partidas:</b> {formatNumber(totals.totalPrecio)} ({ingresoPartidasPercentage}%)</h4>
        <br></br>
        <h4><b>Costo Instructores:</b> {formatNumber(totals.totalCosto)} ({costoInstructoresPercentage}%)</h4>
        <h4><b>Costo Comision de Ventas:</b> {formatNumber(totals.totalComision)} ({totalComisionPercentage}%)</h4>
        <h4><b>Costo Partidas:</b> {formatNumber(totals.totalPartidaCosto)} ({costoPartidasPercentage}%)</h4>
        <h4><b>Otros Costos:</b> {formatNumber(totals.totalComisionCantidad)} ({otrosCostosPercentage}%)</h4>
        <br></br>
        <h4><b>Total Utilidad:</b> {formatNumber(totals.totalUtilidad)} ({utilidadPercentage}%)</h4>
        <hr></hr>
      </div>
      <h2>Instructores en el Proyecto</h2>
      <TableComponent projectData={projectData} onTotalsCalculated={handleTableTotalsCalculated} />
      <h2>Estudiantes en el Proyecto</h2>
      <EstudianteComponent projectData={estudianteData} onTotalsCalculated={handleEstudianteTotalsCalculated} />
      <h2>Partidas en el Proyecto</h2>
      <PartidaComponent projectData={partidaData} onTotalsCalculated={handlePartidaTotalsCalculated} />
      <h2>Otros Costos del Proyecto</h2>
      <ComisionMultiComponent projectData={comisionMultiData} onTotalsCalculated={handleComisionTotalsCalculated} />
      <h2>Utilidad de Partners</h2>
      <UtilidadAbiertaComponent projectData={utilidadAbiertaData} onTotalsCalculated={handleUtilidadTotalsCalculated} />
    </div>
  );
}

export default Project;
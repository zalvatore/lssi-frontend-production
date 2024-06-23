import React from 'react';
import { formatNumber } from '../components/utils';

const ProjectTableRow = ({ instructor }) => (
  <tr key={instructor.pk}>
    <td>{instructor.instructor}</td>
    <td>{instructor.miembro_que_asigna}</td>
    <td>{instructor.horas}</td>
    <td>{formatNumber(instructor.traifa_hora)}</td>
    <td>{formatNumber(instructor.costo_hora)}</td>
    <td>{instructor.moneda}</td>
    <td>{instructor.semanas}</td>
    <td>{instructor.observaciones}</td>
  </tr>
);

export default ProjectTableRow;
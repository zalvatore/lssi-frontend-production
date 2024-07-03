import React from "react";
import { Table } from "reactstrap";
import Moment from 'moment';
import CursoAbiertoModal from "./CursoAbiertoModal";
import CursoAbiertoRemovalModal from "./CursoAbiertoRemovalModal";

const EstudiantesTable = ({ estudiantes, formatCurrency, resetState }) => (
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
                <th>Fecha de Registro</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {!estudiantes || estudiantes.length <= 0 ? (
                <tr>
                    <td colSpan="15" align="center">
                        <b>Ups, todavia no hay partidas!!</b>
                    </td>
                </tr>
            ) : (
                estudiantes.map(estudiante => (
                    <tr key={estudiante.pk}>
                        <td>{estudiante.nombre}</td>
                        <td>{estudiante.partner_vendedor}</td>
                        <td>{estudiante.miembro_vendedor}</td>
                        <td>{estudiante.comision_vendedor}%</td>
                        <td>{estudiante.correo}</td>
                        <td>{estudiante.telefono}</td>
                        <td>{formatCurrency(estudiante.precio)}</td>
                        <td>{estudiante.moneda}</td>
                        <td>{estudiante.referencia}</td>
                        <td>{Moment(estudiante.registration_date).format('MMM/DD/yy')}</td>
                        <td align="center">
                            <CursoAbiertoModal
                                create={false}
                                estudiante={estudiante}
                                resetState={resetState}
                            />
                            &nbsp;&nbsp;
                            <CursoAbiertoRemovalModal
                                pk={estudiante.pk}
                                resetState={resetState}
                            />
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </Table>
);

export default EstudiantesTable;
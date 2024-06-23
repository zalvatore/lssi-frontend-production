import React, { Component } from "react";
import { Table } from "reactstrap";
import Moment from 'moment';
import ProyectoCursoModal from "./ProyectoCursoModal"
import ConfrimPartidaCursoRemovalModal from "./ConfirmPartidaCursoRemovalModal"

class ProyectoDetailCursoList extends Component {
  

    constructor(props) {
      super(props);
      this.state = {
        currentPage: 1,
        searchQuery: "",
      };
    }
  
    render() {
      
      const { partidas_curso } = this.props;

      return (
        <div>
          <Table responsive hover striped bordered>
            <thead>
              <tr>
                <th>Partida Curso Code</th>
                <th>Numero de estudiantes</th>
                <th>Precio por estudiante</th>
                <th>Moneda</th>
                <th>Referencia</th>
                <th>Fecha de Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!partidas_curso || partidas_curso.length <= 0 ? (
                <tr>
                  <td colSpan="15" align="center">
                    <b>Ups, todavia no hay partidas del Curso!!</b>
                  </td>
                </tr>
              ) : (
                partidas_curso.map(partida_curso => (
                  <tr key={partida_curso.pk}>
                    <td>{partida_curso.partida_code.toUpperCase(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{partida_curso.cantidad}</td>
                    <td>{partida_curso.costo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{partida_curso.moneda}</td>
                    <td>{partida_curso.referencia}</td>
                    <td>{Moment(partida_curso.registration_date).format('MMM/DD/yy') }</td>
                    <td align="center">
                        <ProyectoCursoModal
                        create={false}
                        partida_curso={partida_curso}
                        resetState={this.props.resetState}
                        />
                        &nbsp;&nbsp;
                        <ConfrimPartidaCursoRemovalModal
                        pk={partida_curso.pk}
                        resetState={this.props.resetState}
                        />
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      );
    }
  }
  
  export default ProyectoDetailCursoList;
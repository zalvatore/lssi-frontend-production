import React, { Component } from "react";
import { Table } from "reactstrap";
import Moment from 'moment';
import CursoCerradoModal from "./CursoCerradoModal";
import CursoCerradoRemovalModal from "./CursoCerradoRemovalModal";



class CursoCerradoList extends Component {
  

    constructor(props) {
      super(props);
      this.state = {
        currentPage: 1,
        searchQuery: "",
      };
    }
  
    render() {
      
      const { estudiantes_curso_cerado } = this.props;

      return (
        <div>
          <Table responsive hover striped>
            <thead>
              <tr className="table-danger">
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
              {!estudiantes_curso_cerado || estudiantes_curso_cerado.length <= 0 ? (
                <tr>
                  <td colSpan="15" align="center">
                    <b>Ups, todavia no hay partidas!!</b>
                  </td>
                </tr>
              ) : (
                estudiantes_curso_cerado.map(estudiante => (
                  <tr key={estudiante.pk}>
                    <td>{estudiante.partida_code.toUpperCase(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{estudiante.cantidad}</td>
                    <td>{estudiante.costo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{estudiante.moneda}</td>
                    <td>{estudiante.referencia}</td>
                    <td>{Moment(estudiante.registration_date).format('MMM/DD/yy') }</td>
                    <td align="center">
                        <CursoCerradoModal
                        create={false}
                        estudiante={estudiante}
                        resetState={this.props.resetState}
                        />
                        &nbsp;&nbsp;
                        <CursoCerradoRemovalModal
                        pk={estudiante.pk}
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
  
  export default CursoCerradoList;
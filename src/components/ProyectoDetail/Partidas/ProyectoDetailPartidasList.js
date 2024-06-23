import React, { Component } from "react";
import { Table } from "reactstrap";
import Moment from 'moment';
import ProyectoCostoModal from "./ProyectoCostoModal"
import ConfirmPartidaRemovalModal from "./ConfirmPartidaRemovalModal"

class ProyectoDetailPartidasList extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        currentPage: 1,
        searchQuery: "",
      };
    }
  
    render() {
      
      const { partidas } = this.props;


      return (
        <div>
          <Table responsive hover striped bordered>
            <thead>
              <tr className="table-danger">
                <th>Partida</th>
                <th>Producto</th>
                <th>Proveedor</th>
                <th>Precio Unitario</th>
                <th>Costo Unitario</th>
                <th>Cantidad</th>
                <th>Precio Total</th>
                <th>Costo Total</th>
                <th>Moneda</th>
                <th>Referencia</th>
                <th>Fecha de Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!partidas || partidas.length <= 0 ? (
                <tr>
                  <td colSpan="15" align="center">
                    <b>Ups, todavia no hay partidas!!</b>
                  </td>
                </tr>
              ) : (
                partidas.map(partida => (
                  <tr key={partida.pk}>
                    <td>{partida.partida}</td>
                    <td>{partida.producto}</td>
                    <td>{partida.proveedor}</td>
                    <td>{partida.precio.toLocaleString()}</td>
                    <td>{partida.costo.toLocaleString()}</td>
                    <td>{partida.cantidad.toLocaleString()}</td>
                    <td>{partida.totalPrice.toLocaleString()}</td>
                    <td>{partida.totalCost.toLocaleString()}</td>
                    <td>{partida.moneda}</td>
                    <td>{partida.referencia}</td>
                    <td>{Moment(partida.registration_date).format('MMM/DD/yy') }</td>
                    <td align="center">
                        <ProyectoCostoModal
                        create={false}
                        partida={partida}
                        resetState={this.props.resetState}
                        instructores={this.props.instructores}
                        />
                        &nbsp;&nbsp;
                        <ConfirmPartidaRemovalModal
                        pk={partida.pk}
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
  
  export default ProyectoDetailPartidasList;
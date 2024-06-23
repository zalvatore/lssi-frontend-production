import React, { Component } from "react";
import { Table } from "reactstrap";
import ComisionVentaModal from "./ComisionVentaModal";
import ComisionVentaRemovalModal from "./ComisionVentaRemovalModal";

class ComisionVentaList extends Component {

    componentDidMount() {
    }  
    render() {
      
      const {estudiantesIngreso, admins} = this.props;
      return (
        <div>
          <Table responsive hover striped bordered> 
            <thead>
              <tr className="table-danger">
                <th>Comision de Venta</th>
                <th>Cantidad</th>
                <th>Porcentaje de Commission</th>
                <th>Moneda</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!admins || admins.length <= 0 ? (
                <tr>
                  <td colSpan="15" align="center">
                    <b>Ups, todavia no comisiones de venta!!</b>
                  </td>
                </tr>
              ) : (
                admins.map(admin => (
                  <tr key={admin.pk}>
                    <td>{admin.instructor}</td>
                    <td>{admin.subcantidad?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{admin.subcantidad/estudiantesIngreso*100}%</td>
                    <td>{admin.moneda}</td>
                    <td align="center">
                        <ComisionVentaModal
                        create={false}
                        admin={admin}
                        resetState={this.props.resetState}
                        partners = {this.props.partners}
                        proyectoCodeSelected = {this.props.proyectoCodeSelected}
                        proyectoNameSelected = {this.props.proyectoNameSelected}
                        estudiantesIngreso = {estudiantesIngreso}
                        />
                        &nbsp;&nbsp;
                        <ComisionVentaRemovalModal
                        pk={admin.pk}
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
  
  export default ComisionVentaList;
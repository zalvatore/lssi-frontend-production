import React, { Component } from "react";
import { Table } from "reactstrap";
import ProyectoConCausaModal from "./ProyectoConCausaModal";
import ProyectoConCausModalRemover from "./ProyectoConCausModalRemover";

class ProyectoConCausaList extends Component {

    componentDidMount() {
    }  
    render() {
      
      const {estudiantesIngreso, admins} = this.props;
      return (
        <div>
          <Table responsive hover striped bordered> 
            <thead>
              <tr className="table-danger">
                <th>Donador</th>
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
                    <b>Ups, todavia no hay Admin de este curso!!</b>
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
                        <ProyectoConCausaModal
                        create={false}
                        admin={admin}
                        resetState={this.props.resetState}
                        partners = {this.props.partners}
                        proyectoCodeSelected = {this.props.proyectoCodeSelected}
                        proyectoNameSelected = {this.props.proyectoNameSelected}
                        estudiantesIngreso = {estudiantesIngreso}
                        />
                        &nbsp;&nbsp;
                        <ProyectoConCausModalRemover
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
  
  export default ProyectoConCausaList;
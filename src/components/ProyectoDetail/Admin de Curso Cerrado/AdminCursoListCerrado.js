import React, { Component } from "react";
import { Table } from "reactstrap";
import AdminCursoModalCerrado from "./AdminCursoModalCerrado";
import AdminCursoRemovalModalCerrado from "./AdminCursoRemovalModalCerrado";

class AdminCursoListCerrado extends Component {

    componentDidMount() {
    }  
    render() {
      
      const {estudiantesIngreso, admins} = this.props;
      return (
        <div>
         
              {!admins || admins.length <= 0 ? (
                <br />
              ) : (
                <Table responsive hover striped bordered> 
                <thead>
                  <tr className="table-danger">
                    <th>Admin del Curso</th>
                    <th>Cantidad</th>
                    <th>Porcentaje de Commission</th>
                    <th>Moneda</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {admins.map(admin => (
                  <tr key={admin.pk}>
                    <td>{admin.instructor}</td>
                    <td>{admin.subcantidad?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{(admin.subcantidad/estudiantesIngreso*100)?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%</td>
                    <td>{admin.moneda}</td>
                    <td align="center">
                        <AdminCursoModalCerrado
                        create={false}
                        admin={admin}
                        resetState={this.props.resetState}
                        partners = {this.props.partners}
                        proyectoCodeSelected = {this.props.proyectoCodeSelected}
                        proyectoNameSelected = {this.props.proyectoNameSelected}
                        estudiantesIngreso = {estudiantesIngreso}
                        />
                        &nbsp;&nbsp;
                        <AdminCursoRemovalModalCerrado
                        pk={admin.pk}
                        resetState={this.props.resetState}
                        />
                    </td>

                  </tr>
                ))}
            </tbody>
          </Table>
              )}
        </div>
      );
    }
  }
  
  export default AdminCursoListCerrado;
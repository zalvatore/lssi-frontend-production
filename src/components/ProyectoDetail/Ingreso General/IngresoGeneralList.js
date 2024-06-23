import React, { Component } from "react";
import { Table } from "reactstrap";
import IngresoGeneralModal from "./IngresoGeneralModal";
import IngresoGeneralRemovalModal from "./IngresoGeneralRemovalModal";
import { formatNumber } from "../../utils";

class IngresoGeneralList extends Component {

    componentDidMount() {
      //console.log("this.props",this.props)
    }  
    
    render() {
      const {admins} = this.props;
  
      return (
        <div>
          {!admins || admins.length === 0 ? (
            <br />
          ) : (
            <Table responsive hover striped bordered> 
              <thead>
                <tr className="table-danger">
                  <th>Ingreso en General</th>
                  <th>Moneda</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => (
                  <tr key={admin.pk}>
                    <td>{formatNumber(admin.subcantidad)}</td>
                    <td>{admin.moneda}</td>
                    <td align="center">
                      <IngresoGeneralModal
                        create={false}
                        admin={admin}
                        resetState={this.props.resetState}
                        proyectoCodeSelected={this.props.proyectoCodeSelected}
                        proyectoNameSelected={this.props.proyectoNameSelected}
                        estudiantesIngreso={this.props.estudiantesIngreso}
                      />
                      &nbsp;&nbsp;
                      <IngresoGeneralRemovalModal
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
  
  export default IngresoGeneralList;
import React, { Component } from "react";
import { Table } from "reactstrap";
import ConfirmUtilidadRemovalModal from "./ConfirmUtilidadRemovalModal"

class UtilidadList extends Component {

    render() {
        const { utilidades } = this.props;
        console.log('here',utilidades)

        return (
            <div>
                <h1>Test</h1>
                <Table responsive hover striped bordered >
                    <thead>
                        <tr>
                            <th>pk</th>
                            <th>tipo_utilidad</th>
                            <th>porcentaje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilidades.map(utilidad => (
                            <tr key={utilidad.pk}>
                                <td>{utilidad.pk}</td>
                                <td>{utilidad.tipo_utilidad}</td>
                                <td>{utilidad.porcentaje}</td>
                                <td align="center">
                                    &nbsp;&nbsp;
                                    <ConfirmUtilidadRemovalModal
                                    pk={utilidad.pk}
                                    resetState={this.props.resetState}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default UtilidadList;

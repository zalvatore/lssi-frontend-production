import React from "react";
import { Table } from "reactstrap";

const ComisionSummary = ({ totalComisionByVendedor, formatCurrency }) => (
    <Table responsive hover striped bordered>
        <thead>
            <tr className="table-danger">
                <th>Vendedor</th>
                <th>Comision</th>
                <th>Total Venta</th>
                <th>Moneda</th>
            </tr>
        </thead>
        <tbody>
            {totalComisionByVendedor && Object.entries(totalComisionByVendedor).map(([vendedor, comision]) => (
                <tr key={vendedor}>
                    <td>{vendedor}</td>
                    <td>$ {formatCurrency(comision.totalComision)}</td>
                    <td>$ {formatCurrency(comision.totalPrecio)}</td>
                    <td>{comision.moneda}</td>
                </tr>
            ))}
        </tbody>
    </Table>
);

export default ComisionSummary;
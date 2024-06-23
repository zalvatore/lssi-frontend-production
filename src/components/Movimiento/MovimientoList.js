import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import MovimientoModal from "./MovimientoModal";
import Moment from 'moment';

class MovimientoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchQuery: "",
    };
  }

  handlePageChange = (page) => {
    this.setState({
      currentPage: page
    });
  };

  handleSearchChange = (event) => {
    this.setState({
      searchQuery: event.target.value
    });
  };

  handleCuentaChange = (event) => {
    this.setState({
      selectedCuenta: event.target.value
    });
  };

  render() {
    
    const { movimientos, itemsPerPage } = this.props;
    const { currentPage, searchQuery, selectedCuenta } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Get unique 'Cuenta' entries
    const uniqueCuentas = [...new Set(movimientos.map(movimiento => movimiento.cuenta))];

    let filteredData = movimientos.filter(movimiento =>
      (movimiento.referencia_alfa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movimiento.referencia_numerica?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCuenta ? movimiento.cuenta === selectedCuenta : true)
    );
  
    filteredData = filteredData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCalc = Math.ceil(filteredData.length / itemsPerPage);
    const totalPagesMax = 20
    const totalPages = totalPagesCalc < totalPagesMax ? totalPagesCalc : totalPagesMax;
    
    return (
      <div>

        <Input
          type="text"
          placeholder="Busca"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />
        <Input type="select" value={selectedCuenta} onChange={this.handleCuentaChange}>
        <option value="">Todas las Cuentas</option>
        {uniqueCuentas.map((cuenta, index) => (
          <option key={index} value={cuenta}>
            {cuenta}
          </option>
        ))}
      </Input>

        <Table responsive dark hover> 
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Fecha Movimiento</th>
              <th>Ref Alfa</th>
              <th>Ref Num</th>
              <th>Authorizacion</th>
              <th>Descripcion</th>
              <th>Descripcion Larga</th>
              <th>Movimiento</th>
              <th>Proyecto Asignado</th>
              <th>Codigo Proyecto</th>
              <th>Value Stream</th>
              <th>Box Score</th>
              <th>Miembro Compartido</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!movimientos || movimientos.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay Movimientos!!</b>
                </td>
              </tr>
            ) : (
              currentData
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)) // Sort by fecha in descending order
              .map(movimiento => (
                <tr key={movimiento.pk}>
                  <td>{movimiento.cuenta}</td>
                  <td>{Moment(movimiento.fecha).format('MMM/DD/yy')}</td>
                  <td>{movimiento.referencia_alfa}</td>
                  <td>{movimiento.referencia_numerica}</td>
                  <td>{movimiento.autorizacion}</td>
                  <td>{movimiento.movimiento_txt}</td>
                  <td>{movimiento.descripcion}</td>
                  <td>{movimiento.movimiento.toLocaleString()}</td>
                  <td>{movimiento.proyecto}</td>
                  <td>{movimiento.proyecto_code}</td>
                  <td>{movimiento.valueStream ? movimiento.valueStream.toUpperCase() : ''}</td>
                  <td>{movimiento.boxScore}</td>
                  <td>{movimiento.miembro_comp}</td>
                  <td align="center">
                    <MovimientoModal
                      create={false}
                      movimiento={movimiento}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Pagination  size="lg" aria-label="Page navigation example">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink previous onClick={() => this.handlePageChange(currentPage - 1)} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page} active={currentPage === page}>
              <PaginationLink onClick={() => this.handlePageChange(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink next onClick={() => this.handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </Pagination>

      </div>
    );
  }
}

export default MovimientoList;
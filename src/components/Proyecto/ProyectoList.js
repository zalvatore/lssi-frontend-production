import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import NewProyectoModal from "./NewProyectoModal";
import ConfirmProyecotRemovalModal from "./ConfirmProyectoRemovalModal";
import Moment from 'moment';

class ProeyctoList extends Component {

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

  getStatusColor = (status) => {
    switch (status) {
      case "Activo":
        return "#90EE90";
      case "Terminado":
        return "orange";
      case "En pausa":
        return "#00D8D8";
      case "En negociación":
        return "yellow";
      case "Terminado con Saldo":
        return "#B2560D";
      case "Vencido":
        return "red";
      default:
        return "black";
    }
  };

  render() {
    
    const { proyectos, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = proyectos.filter(proyecto =>
      proyecto.proyecto_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyecto.modalidad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyecto.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCalc = Math.ceil(filteredData.length / itemsPerPage);
    const totalPagesMax = 4
    const totalPages = totalPagesCalc < totalPagesMax ? totalPagesCalc : totalPagesMax;
    
    return (
      <div>
        <Input
          type="text"
          placeholder="Busca"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />

        <Table responsive striped hover bordered dark> 
          <thead>
            <tr>
              <th>Status</th>
              <th>Proeycto Code</th>
              <th>Proyecto</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Modalidad</th>
              <th>Fecha inicio</th>
              <th>Fecha terminacion</th>
              <th>Moneda</th>
              <th>Coaching/Lider</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!proyectos || proyectos.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay proyectos!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(proyecto => (
                <tr key={proyecto.pk}>
                  <td style={{ color: this.getStatusColor(proyecto.status) }}>{proyecto.status}</td>
                  <td>{proyecto.proyecto_code}</td>
                  <td>{proyecto.name}</td>
                  <td>{proyecto.cliente}</td>
                  <td>{proyecto.producto}</td>
                  <td>{proyecto.modalidad}</td>
                  <td>{Moment(proyecto.inicio_date).format('MMM/DD/yy ') }</td>
                  <td>{Moment(proyecto.terminacion_date).format('MMM/DD/yy') }</td>
                  <td>{proyecto.moneda}</td>
                  <td>{proyecto.lider}</td>
                  <td align="center">
                    <NewProyectoModal
                      create={false}
                      proyecto={proyecto}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmProyecotRemovalModal
                      pk={proyecto.pk}
                      resetState={this.props.resetState}
                    />
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

export default ProeyctoList;
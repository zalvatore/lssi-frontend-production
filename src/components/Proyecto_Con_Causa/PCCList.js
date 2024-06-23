import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import PCCModal from "./PCCModal";
import PCCRemovalModal from "./PCCRemovalModal";
import Moment from 'moment';

class PCCList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchQuery: "",
    };
  }

  componentDidMount() {
    //console.log('Data', this.props.costos)
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

  render() {
    
    const { costos, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = costos.filter(costo =>
      costo.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      costo.nombre_contacto?.toLowerCase().includes(searchQuery.toLowerCase()) 
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


        <Table responsive dark hover> 
          <thead>
            <tr>
              <th>Codigo de Costo</th>
              <th>Nombre</th>
              <th>Nombre Contacto</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Pais</th>
              <th>Observaciones</th>
              <th>Fecha de registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!costos || costos.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no Partidas con Causa!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(pcc => (
                <tr key={pcc.pk}>
                  <td>{pcc.pcc_code.toUpperCase()}</td>
                  <td>{pcc.nombre}</td>
                  <td>{pcc.nombre_contacto}</td>
                  <td>{pcc.email}</td>
                  <td>{pcc.ciudad}</td>
                  <td>{pcc.pais}</td>
                  <td>{pcc.observaciones}</td>
                  <td>{Moment(pcc.registration_date).format('MMM/DD/yy') }</td>
                  <td align="center">
                    <PCCModal
                      create={false}
                      costo={pcc}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <PCCRemovalModal
                      pk={pcc.pk}
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

export default PCCList;
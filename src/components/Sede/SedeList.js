import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import NewSedeModal from "./NewSedeModal";
import ConfirmSedeRemovalModal from "./ConfirmSedeRemovalModal";
import Moment from 'moment';

class SedeList extends Component {

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

  render() {
    
    const { sedes, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = sedes.filter(sede =>
      sede.sede_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sede.sede?.toLowerCase().includes(searchQuery.toLowerCase()) 
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

        <Table responsive hover striped bordered> 
          <thead>
            <tr>
              <th>Value Stream</th>
              <th>Fecha de registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!sedes || sedes.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay sedes!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(sede => (
                <tr key={sede.pk}>
                  <td>{sede.sede}</td>
                  <td>{Moment(sede.registration_date).format('MMM/DD/yy') }</td>
                  <td align="center">
                    <NewSedeModal
                      create={false}
                      sede={sede}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmSedeRemovalModal
                      pk={sede.pk}
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

export default SedeList;
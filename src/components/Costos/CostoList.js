import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import NewCostoModal from "./NewCostoModal";
import ConfirmCostoRemovalModal from "./ConfirmCostoRemovalModal";
import Moment from 'moment';

class CostoList extends Component {

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
    
    const { costos, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = costos.filter(costo =>
      costo.costo_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      costo.costo?.toLowerCase().includes(searchQuery.toLowerCase()) 
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
              <th>Costo</th>
              <th>Fecha de registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!costos || costos.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay costos!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(costo => (
                <tr key={costo.pk}>
                  <td>{costo.costo_code.toUpperCase()}</td>
                  <td>{costo.costo}</td>
                  <td>{Moment(costo.registration_date).format('MMM/DD/yy') }</td>
                  <td align="center">
                    <NewCostoModal
                      create={false}
                      costo={costo}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmCostoRemovalModal
                      pk={costo.pk}
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

export default CostoList;
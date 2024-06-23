import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import NewProductoModal from "./NewProductoModal";
import ConfirmProdcutoRemovalModal from "./ConfirmProdcutoRemovalModal"
import Moment from 'moment';

class ProductoList extends Component {

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
    
    const { productos, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredData = productos.filter(producto =>
      producto.producto_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producto.tipo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <th>Codigo de Producto</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Fecha de Registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!productos || productos.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay productos!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(producto => (
                <tr key={producto.pk}>
                  <td>{producto.producto_code.toUpperCase()}</td>
                  <td>{producto.tipo}</td>
                  <td>{producto.nombre}</td>
                  <td>{Moment(producto.registration_date).format('MMM/DD/yy hh:mm') }</td>
                  <td align="center">
                    <NewProductoModal
                      create={false}
                      producto={producto}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmProdcutoRemovalModal
                      pk={producto.pk}
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

export default ProductoList;
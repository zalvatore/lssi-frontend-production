import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import { Col, Row, Label } from "reactstrap";
import NewClientModal from "./NewClientModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import Moment from 'moment';


class ClientList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchQuery: "",
      selectedSede: "",
      sedeFilter:''
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

  handleSedeChange = (event) => {
    this.setState({
      selectedSede: event.target.value
    });
  };

  handleSedeFilterChange = (e) => {
    const sedeFilter = e.target.value;
    this.setState({ sedeFilter });
  };


  render() {
    
    const { clients, itemsPerPage } = this.props;
    const { 
      currentPage, 
      searchQuery, 
      selectedSede,
      sedeFilter } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const filteredData = clients.filter(client =>
      (client.sede && client.sede.toLowerCase().includes(sedeFilter.toLowerCase())) &&
      (client.razon_social?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.id_fiscal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.giro?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.nombre_comprador?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.nombre_admin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pais?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.codigo_postal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.estado?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.ciudad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.calle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.client_code?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCalc = Math.ceil(filteredData.length / itemsPerPage);
    const totalPagesMax = 13
    const totalPages = totalPagesCalc < totalPagesMax ? totalPagesCalc : totalPagesMax;

    const uniqueSedes = Array.from(new Set(clients.map(client => client.sede)));
    
    return (
      <div>
        <Row>
          <Col>
            <Label for="sede"></Label>
            <Input
              type="select"
              name="sede"
              value={selectedSede}
              onChange={this.handleSedeFilterChange}
            >
              <option value="">Todos los Value Streams</option>
              {uniqueSedes.map((sede, index) => (
                <option key={index} value={sede}>{sede}</option>
              ))}
            </Input>
          </Col>
        </Row>
        <br></br>
        <Input
          type="text"
          placeholder="Busca"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />

        <Table responsive hover striped > 
          <thead>
            <tr>
              <th>Razon Social</th>
              <th>Id Fiscal</th>
              <th>Nombre Comercial</th>
              <th>Giro</th>
              <th>Value Stream</th>
              <th>Nombre Comprador</th>
              <th>Nombre C x P</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Pais</th>
              <th>Codigo Postal</th>
              <th>Estado</th>
              <th>Ciudad</th>
              <th>Calle y Numero</th>
              <th>Fecha de Registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!clients || clients.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay clientes!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(client => (
                <tr key={client.pk}>
                  <td>{client.razon_social}</td>
                  <td>{client.id_fiscal}</td>
                  <td>{client.nombre}</td>
                  <td>{client.giro}</td>
                  <td>{client.sede}</td>
                  <td>{client.nombre_comprador}</td>
                  <td>{client.nombre_admin}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.pais}</td>
                  <td>{client.codigo_postal}</td>
                  <td>{client.estado}</td>
                  <td>{client.ciudad}</td>
                  <td>{client.calle}</td>
                  <td>{Moment(client.registration_date).format('MMM/DD/yy hh:mm') }</td>
                  <td align="center">
                    <NewClientModal
                      create={false}
                      client={client}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmRemovalModal
                      pk={client.pk}
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

export default ClientList;
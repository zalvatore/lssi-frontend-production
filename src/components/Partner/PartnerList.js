import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input, FormGroup, Label, Col, Row } from "reactstrap";
import NewPartnerModal from "./NewPartnerModal";
import ConfirmPartnerRemovalModal from "./ConfirmPartnerRemovalModal";
import Moment from 'moment';

class PartnerList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchQuery: "",
      selectedValueStream: "",
      selectedLocalizacion: ""
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

  handleValueStreamChange = (event) => {
    this.setState({
      selectedValueStream: event.target.value
    });
  };

  handleLocalizacionChange = (event) => {
    this.setState({
      selectedLocalizacion: event.target.value
    });
  };

 
  render() {
    
    const { partners, itemsPerPage } = this.props;
    const { currentPage, searchQuery, selectedValueStream, selectedLocalizacion } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Extract unique localizacion values from partners
    const uniqueLocalizaciones = [...new Set(partners.map(partner => partner.localizacion))];
    const uniqueValuestream = [...new Set(partners.map(partner => partner.grupo))];
    

    const filteredData = partners.filter(partner =>
      (partner.partner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.nivel?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedValueStream === "" || partner.grupo === selectedValueStream) &&
      (selectedLocalizacion === "" || partner.localizacion === selectedLocalizacion)
    );

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPagesCalc = Math.ceil(filteredData.length / itemsPerPage);
    const totalPagesMax = 4;
    const totalPages = totalPagesCalc < totalPagesMax ? totalPagesCalc : totalPagesMax;
    
    
    return (
      <div>
        
         <Row>
          <Col>
            <FormGroup>
              <Label for="valueStreamSelect">Value Stream:</Label>
              <Input type="select" name="valueStreamSelect" id="valueStreamSelect" value={selectedValueStream} onChange={this.handleValueStreamChange}>
                <option key='0' value="">All</option>
                {uniqueValuestream.map(valuestream => (
                  <option key={valuestream} value={valuestream}>{valuestream}</option>
                ))}
                {/* Add more options as needed */}
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="localizacionSelect">Localizacion:</Label>
              <Input type="select" name="localizacionSelect" id="localizacionSelect" value={selectedLocalizacion} onChange={this.handleLocalizacionChange}>
                <option key='0' value="">All</option>
                {uniqueLocalizaciones.map(localizacion => (
                  <option key={localizacion} value={localizacion}>{localizacion}</option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>

        <Input
          type="text"
          placeholder="Busca"
          value={searchQuery}
          onChange={this.handleSearchChange}
        />

        <Table responsive dark hover> 
          <thead>
            <tr>
              <th>Codigo de Miembro</th>
              <th>Miembro</th>
              <th>Nivel</th>
              <th>Correo de Miembro</th>
              <th>Value Stream</th>
              <th>Localizacion</th>
              <th>IVA</th>
              <th>Retencion IVA</th>
              <th>Retencion ISR/IRPF</th>
              <th>Fecha de Ingreeso</th>
              <th>Fecha de Cumpleaños</th>
              <th>Fecha de Registro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!partners || partners.length <= 0 ? (
              <tr>
                <td colSpan="15" align="center">
                  <b>Ups, todavia no hay miembros en el equipo!!</b>
                </td>
              </tr>
            ) : (
              currentData.map(partner => (
                <tr key={partner.pk}>
                  <td>{partner.partner_code.toUpperCase()}</td>
                  <td>{partner.partner}</td>
                  <td>{partner.nivel}</td>
                  <td>{partner.email}</td>
                  <td>{partner.grupo}</td>
                  <td>{partner.localizacion}</td>
                  <td>{partner.iva}</td>
                  <td>{partner.retencion}</td>
                  <td>{partner.isr}</td>
                  <td>{Moment(partner.ingreso_date).format('MMM/DD/yy') }</td>
                  <td>{Moment(partner.cumple_date).format('MMM/DD') }</td>
                  <td>{Moment(partner.registration_date).format('MMM/DD/yy') }</td>
                  <td align="center">
                    <NewPartnerModal
                      create={false}
                      partner={partner}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmPartnerRemovalModal
                      pk={partner.pk}
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

export default PartnerList;
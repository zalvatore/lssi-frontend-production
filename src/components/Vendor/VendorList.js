import React, { Component } from "react";
import { Table, Pagination, PaginationItem, PaginationLink, Input } from "reactstrap";
import { Col, Row } from "reactstrap";
import NewVendorModal from "./NewVendorModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
import Moment from 'moment';

class VendorList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      searchQuery: ""
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
    
    const { vendors, itemsPerPage } = this.props;
    const { currentPage, searchQuery } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    const filteredData = vendors.filter(vendor =>
      vendor.vendor?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
      <div>
        <Row>
          <Col>
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
          </Col>
        </Row>
        <br />
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Registration Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!vendors || vendors.length <= 0 ? (
              <tr>
                <td colSpan="3" align="center">
                  <b>No vendors yet!</b>
                </td>
              </tr>
            ) : (
              currentData.map(vendor => (
                <tr key={vendor.pk}>
                  <td>{vendor.vendor}</td>
                  <td>{Moment(vendor.registration_date).format('MMM/DD/yy hh:mm')}</td>
                  <td align="center">
                    <NewVendorModal
                      create={false}
                      vendor={vendor}
                      resetState={this.props.resetState}
                    />
                    &nbsp;&nbsp;
                    <ConfirmRemovalModal
                      pk={vendor.pk}
                      resetState={this.props.resetState}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Pagination size="lg" aria-label="Page navigation example">
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

export default VendorList;
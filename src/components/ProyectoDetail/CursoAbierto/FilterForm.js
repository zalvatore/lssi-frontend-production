import React from "react";
import { FormGroup, Label, Input, Col, Row } from "reactstrap";

const FilterForm = ({ filterNombre, filterPartner, filterVendedor, handleFilterChange }) => (
    <Row form>
        <Col md={4}>
            <FormGroup>
                <Label for="filterNombre">Filtro por estudiante:</Label>
                <Input
                    type="text"
                    name="filterNombre"
                    id="filterNombre"
                    value={filterNombre}
                    onChange={handleFilterChange}
                />
            </FormGroup>
        </Col>
        <Col md={4}>
            <FormGroup>
                <Label for="filterPartner">Filtro por Partner:</Label>
                <Input
                    type="text"
                    name="filterPartner"
                    id="filterPartner"
                    value={filterPartner}
                    onChange={handleFilterChange}
                />
            </FormGroup>
        </Col>
        <Col md={4}>
            <FormGroup>
                <Label for="filterVendedor">Filtro por Vendedor:</Label>
                <Input
                    type="text"
                    name="filterVendedor"
                    id="filterVendedor"
                    value={filterVendedor}
                    onChange={handleFilterChange}
                />
            </FormGroup>
        </Col>
    </Row>
);

export default FilterForm;
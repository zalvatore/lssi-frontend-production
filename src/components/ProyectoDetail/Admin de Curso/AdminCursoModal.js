import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import AdminCursoForm from "./AdminCursoForm"

class AdminCursoModal extends Component {


    state = {
        modal: false
      };

    toggle = () => {
    this.setState(previous => ({
        modal: !previous.modal
    }));
    };  

    render() {
        const create = this.props.create;
        const proyectoCode = this.props.proyectoCodeSelected;
        const proyectoName = this.props.proyectoNameSelected;
        const admin = this.props.admin;
        const partners = this.props.partners;
        const estudiantesIngreso = this.props.estudiantesIngreso;

        var title = "Editando Admininstrador del Curso";
        var button = <Button onClick={this.toggle}>
        Editar
        </Button>;

        if (create) {
            title = "Aggregando Adminstrador del Curso ";

            button = (
            <Button
                color="primary"
                className="float-right"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar Adminstrador de Curso
            </Button>
            );
        }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <AdminCursoForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              proyectoCode= {proyectoCode}
              proyectoName = {proyectoName}
              partners={partners}
              estudiantesIngreso = {estudiantesIngreso}
              admin = {admin}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default AdminCursoModal;
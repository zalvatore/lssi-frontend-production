import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import ProyectoCursoForm from "./ProyectoCursoForm"

class ProyectoCursoModal extends Component {
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

        var title = "Editando Estudiantes del Curso Cerrado";
        var button = <Button onClick={this.toggle}>
        Editar
        </Button>;

        if (create) {
            title = "Aggregadno Estudiantes al Curso Cerrado";

            button = (
            <Button
                color="primary"
                className="float-right"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar Estudiantes al Curso
            </Button>
            );
        }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <ProyectoCursoForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              proyectoCode= {proyectoCode}
              proyectoName = {proyectoName}
              partida_curso={this.props.partida_curso}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default ProyectoCursoModal;
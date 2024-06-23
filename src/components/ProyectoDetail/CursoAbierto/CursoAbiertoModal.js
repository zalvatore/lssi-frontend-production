import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import CursoAbiertoFor from "./CursoAbiertoFor"

class CursoAbiertoModal extends Component {
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

        var title = "Editando Estudiante en Curso Abierto";
        var button = <Button onClick={this.toggle}>
        Editar
        </Button>;

        if (create) {
            title = "Creando Estudiante en Curso Abierto";

            button = (
            <Button
                color="primary"
                //className="float-right"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar estudiante del Curso
            </Button>
            );
        }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <CursoAbiertoFor
              resetState={this.props.resetState}
              toggle={this.toggle}
              proyectoCode= {proyectoCode}
              proyectoName = {proyectoName}
              estudiante={this.props.estudiante}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default CursoAbiertoModal;
import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import CursoCerradoFrom from "./CursoCerradoForm";

class CursoCerradoModal extends Component {
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

        // Add this line to log the value of estudiante to the console
        //console.log("estudiante logger", this.props.estudiante);

        var title = "Editando Estudiantes en Curso Cerrado 2";
        var button = <Button onClick={this.toggle}>
        Editar
        </Button>;

        if (create) {
            title = "Creando Partida Estudiantes en Curso Cerrado 2 ";

            button = (
            <Button
                color="primary"
                //className="float-right"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar Partida 2
            </Button>
            );
        }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <CursoCerradoFrom
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

export default CursoCerradoModal;
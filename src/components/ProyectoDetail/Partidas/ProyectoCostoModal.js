import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import ProyectoPartidaForm from "./ProyectoPartidaForm"

class ProyectoCostoModal extends Component {
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
        var title = "Editando Partida de Proyecto";
        var button = <Button onClick={this.toggle}>
        Editar
        </Button>;

        if (create) {
            title = "Creando Partida de Proyecto ";

            button = (
            <Button
                color="primary"
                //className="float-right"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar Partida
            </Button>
            );
        }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <ProyectoPartidaForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              proyectoCode= {proyectoCode}
              proyectoName = {proyectoName}
              partida={this.props.partida}
              instructores={this.props.instructores}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default ProyectoCostoModal;
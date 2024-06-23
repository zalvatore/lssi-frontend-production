import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import NewProyectoForm from "./NewProyectoForm";

class NewProyectoModal extends Component {
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

    var title = "Editando Proyecto";
    var button = <Button onClick={this.toggle}>
      Editar
      </Button>;
    if (create) {
      title = "Creando Nuevo Proyecto";

      button = (
        <Button
          color="primary"
          className="float-right"
          onClick={this.toggle}
          style={{ minWidth: "200px" }}
        >
          Crear Nuevo
        </Button>
      );
    }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>

          <ModalBody>
            <NewProyectoForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              proyecto={this.props.proyecto}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default NewProyectoModal;
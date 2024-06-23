import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import NewCostoForm from "./NewCostoForm";

class NewCostoModal extends Component {
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

    var title = "Editando Costo Directo";
    var button = <Button onClick={this.toggle}>
      Editar
      </Button>;
    if (create) {
      title = "Creando Costo Directo";

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
            <NewCostoForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              costo={this.props.costo}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default NewCostoModal;
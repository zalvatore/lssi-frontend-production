import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import MovimientoForm from "./MovimientoForm";

class MovimientoModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState(previous => ({
      modal: !previous.modal
    }));
  };

  render() {

    var title = "Editando Movimiento";
    var button = <Button onClick={this.toggle}>
      Editar
      </Button>;

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>

          <ModalBody>
            <MovimientoForm
              resetState={this.props.resetState}
              toggle={this.toggle}
              movimiento={this.props.movimiento}
              proyecto={this.props.proyecto}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default MovimientoModal;
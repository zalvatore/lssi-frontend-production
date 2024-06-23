import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import PCCForm from "./PCCForm";

class PCCModal extends Component {
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

    var title = "Editando Proyecto con Causa";
    var button = <Button onClick={this.toggle}>
      Editar
      </Button>;
    if (create) {
      title = "Creando Proyecto con Causa";

      button = (
        <Button
          color="primary"
          className="float-right"
          onClick={this.toggle}
          style={{ minWidth: "200px" }}
        >
          Crear Proyecto con Causa
        </Button>
      );
    }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>

          <ModalBody>
            <PCCForm
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

export default PCCModal;
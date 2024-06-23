import React, { Component, Fragment } from "react";
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap";
import axios from "axios";
import { API_URL_partners } from "../../constants";
import Cookies from 'js-cookie';

class ConfirmPartnerRemovalModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState(previous => ({
      modal: !previous.modal
    }));
  };

  deletePartner = pk => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.delete(API_URL_partners + pk, { headers }).then(() => {
      this.props.resetState();
      this.toggle();
    });
  };

  render() {
    return (
      <Fragment>
        <Button color="danger" onClick={() => this.toggle()}>
          Remover
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Seguro desas borrar el miembro??
          </ModalHeader>

          <ModalFooter>
            <Button type="button" onClick={() => this.toggle()}>
              Cancelar
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={() => this.deletePartner(this.props.pk)}
            >
              Si
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default ConfirmPartnerRemovalModal;
import React, { Component, Fragment } from "react";
import { Modal, ModalHeader, Button, ModalFooter } from "reactstrap";
import Cookies from 'js-cookie';
import axios from "axios";
import { API_URL_partidas_curso } from "../../../constants";

class ConfirmPartidaCursoRemovalModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState(previous => ({
      modal: !previous.modal
    }));
  };

  deletePartida= pk => {
    const token = Cookies.get("token"); 
    const headers = { Authorization: `Token ${token}` };
    axios.delete(API_URL_partidas_curso + pk, { headers }).then(() => {
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
            Seguro desas borrar la partida de Estudiantes??
          </ModalHeader>

          <ModalFooter>
            <Button type="button" onClick={() => this.toggle()}>
              Cancelar
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={() => this.deletePartida(this.props.pk)}
            >
              Si
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

export default ConfirmPartidaCursoRemovalModal;
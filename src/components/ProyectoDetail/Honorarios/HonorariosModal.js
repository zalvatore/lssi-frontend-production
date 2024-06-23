import React, { Component, Fragment } from "react";
import {Modal, ModalBody, Button, ModalHeader } from "reactstrap";
import HonorariosForm from "./HonorariosForm"

class HonorariosModal extends Component {
    state = {
        modal: false
      };

    toggle = () => {
    this.setState(previous => ({
        modal: !previous.modal
    }));
    }; 

    render(){
        const create = this.props.create;
        const proyectoCode = this.props.proyectoCodeSelected;
        const proyectoName = this.props.proyectoNameSelected;
        var title = "Editando Honorarios de Proyecto";
        var button = <Button onClick={this.toggle}>
            Editar
            </Button>;

        if (create) {
            title = "Creando Honorario de Proyecto ";

            button = (
            <Button
                color="primary"
                onClick={this.toggle}
                style={{ minWidth: "200px" }}
            >
                Agregar Honorario
            </Button>
            );

        }

        return (

            <Fragment>
                {button}
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
                <ModalBody>
                    <HonorariosForm
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

        )

    }

} export default HonorariosModal;
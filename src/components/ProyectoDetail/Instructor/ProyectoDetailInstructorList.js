import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import Moment from 'moment';
import ProyectoIngresoModal from "./ProyectoIngresoModal";
import ConfirmInstructorRemovalModal from "./ConfirmInstructorRemovalModal"
import emailjs from '@emailjs/browser';
import Cookies from "js-cookie";
import { 
  getPartnersAndInstructors,
 } from "../../../api-services";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ProyectoDetailInstructorList extends Component {

    constructor(props) {
      super(props);
      this.state = {
        currentPage: 1,
        searchQuery: "",
        filteredData: [],  
      };
    }

    componentDidMount() {
      this.fetchPartnersAndInstructors();
    }

    // Create a separate function for the API call
    fetchPartnersAndInstructors = async () => {
      const token = Cookies.get("token");
      const headers = { Authorization: `Token ${token}` };
      const instructoresValues = this.props.instructores.map(
        (instructor) => instructor.instructor
      );
  
      try {
        const PartnersAndInstructores = await getPartnersAndInstructors(headers);
        const filteredData = PartnersAndInstructores.filter((item) =>
          instructoresValues.includes(item.partner)
        );
        this.setState({ filteredData });
  
        // Return filteredData after it has been set in the state
        return filteredData;
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching data:", error);
        throw error; // Rethrow the error to be caught in the caller
      }
    };


    sendEmail = async (e) => {
      e.preventDefault();
    
      try {
        const filteredData = await this.fetchPartnersAndInstructors();
        console.log('filteredData', filteredData)
        const { proyectoNameSelected, selectedProyecto } = this.props;
        
        for (const instructor of filteredData) {
          const emailParams = {
            to_email: 'sanchez.salvador@gmail.com',
            to_email2: 'salvador@lidigo.io',
            to_email3: instructor.email,
            from_name: 'Bernardo Gonzalez',
            to_name: instructor.partner,
            reply_to: 'bgonzalez@leansixsigmainstitute.org',
            instructor: instructor.partner,
            miembro_que_asigna: instructor.instructor.miembro_que_asigna,
            horas: instructor.instructor.horas,
            costo_hora: instructor.instructor.costo_hora.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
            moneda: instructor.instructor.moneda,
            semanas: instructor.instructor.semanas,
            observaciones: instructor.instructor.observaciones,
            proyectoNameFrom: proyectoNameSelected,
            cliente: selectedProyecto.cliente,
            producto: selectedProyecto.producto,
            fecha_inicio: Moment(selectedProyecto.inicio_date).format('MMM/DD/yy'),
            fecha_final: Moment(selectedProyecto.terminacion_date).format('MMM/DD/yy'),
            modalidad: selectedProyecto.modalidad,
            lider: selectedProyecto.lider,
            pago_hora: instructor.instructor.costo_hora.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
            ingreso_instructor: (instructor.instructor.costo_hora * instructor.instructor.horas * instructor.instructor.semanas).toLocaleString(),
            email: instructor.email,
          };
  
          try {
            const result = await emailjs.send('service_orze3qe', 'template_he5jinj', emailParams, 'VBYWnQsgbxRBcGQ8N');
            console.log(result.text);
            toast.success(`Email sent to ${instructor.partner}`);
          } catch (error) {
            console.error("Error sending email:", error);
            toast.error(`Failed to send email to ${instructor.partner}`);
          }
        }
        // Rest of your code here
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    };
    
    render() {
      
      const { instructores } = this.props;

      return (
        <div>
          <ToastContainer />
          <Table responsive hover striped bordered> 
            <thead>
              <tr className="table-danger">
                <th>Instuctor</th>
                <th>Partner que Asigna</th>
                <th>Horas x Semana</th>
                <th>Precio x Hora</th>
                <th>Costo x Hora</th>
                <th>Moneda</th>
                <th>Numero de Semanas</th>
                <th>Observaciones</th>
                <th>Fecha de Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {!instructores || instructores.length <= 0 ? (
                <tr>
                  <td colSpan="15" align="center">
                    <b>Ups, todavia no hay instructores!!</b>
                  </td>
                </tr>
              ) : (
                instructores.map(instructor => (
                  <tr key={instructor.pk}>
                    <td>{instructor.instructor}</td>
                    <td>{instructor.miembro_que_asigna}</td>
                    <td>{instructor.horas}</td>
                    <td>{instructor.traifa_hora.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{instructor.costo_hora.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>{instructor.moneda}</td>
                    <td>{instructor.semanas}</td>
                    <td>{instructor.observaciones}</td>
                    <td>{Moment(instructor.registration_date).format('MMM/DD/yy') }</td>
                    <td align="center">
                        <ProyectoIngresoModal
                        create={false}
                        instructor={instructor}
                        resetState={this.props.resetState}
                        />
                        &nbsp;&nbsp;
                        <ConfirmInstructorRemovalModal
                        pk={instructor.pk}
                        resetState={this.props.resetState}
                        />
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </Table>
          < Button 
            color="success"
            onClick={this.sendEmail}
          > 
          Enviar correo a instructores 
          </Button>

  
        </div>
      );
    }
  }
  
  export default ProyectoDetailInstructorList;
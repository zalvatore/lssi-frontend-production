import React, { Component } from "react";
import { API_URL_instructores } from "../constants";
import Cookies from "js-cookie";
import axios from "axios";

class EstadoInstructor extends Component {
  state = {
    allInstructores: [], // Store all instructors
    instructores: [], // Store unique instructors
  };

  componentDidMount() {
    const token = Cookies.get("token");
    const headers = { Authorization: `Token ${token}` };

    axios
      .get(API_URL_instructores, { headers })
      .then((instructorsResponse) => {
        const allInstructors = instructorsResponse.data;
        const uniqueInstructors = Array.from(
          new Set(allInstructors.map((instructor) => instructor.instructor))
        ).map((instructorName) => {
          return allInstructors.find(
            (instructor) => instructor.instructor === instructorName
          );
        });

        this.setState({
          allInstructores: allInstructors,
          instructores: uniqueInstructors,
        });
      })
      .catch((error) => console.log("Error fetching instructores:", error));
  }

  render() {
    const { instructores } = this.state;

    return (
      <div>
        <h1>Estado de Cuenta por Instructor</h1>
        <hr />
        <div>
          <select>
            <option key="0" value="">
              Selecciona Partner
            </option>
            {instructores
              .sort((a, b) => a.instructor.localeCompare(b.instructor))
              .map((instructor) => (
                <option key={instructor.pk} value={instructor.instructor}>
                  {instructor.instructor}
                </option>
              ))}
          </select>
        </div>
      </div>
    );
  }
}

export default EstadoInstructor;

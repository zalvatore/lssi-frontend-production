import axios from "axios";
import { 
  API_URL_proyectos, 
  API_URL_partners, 
  API_URL_instructores,
  API_URL_partidas,
  API_URL_utilidad,
  API_URL_utilidades_partners,
} from "./constants";

export class API {
    static loginUser(body) {
      return fetch(`https://lssi-backend-82b2d4696f39.herokuapp.com/auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( body )
      }).then( resp => resp.json())
    }
  }

export const getProyectos = (headers) => {
  return axios.get(API_URL_proyectos, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Proyectos:", error);
      throw error; // Rethrow the error to propagate it to the caller, if needed
    });
};

/*
export const getPartners = (headers) => {
  return axios.get(API_URL_partners, { headers })
  .then(res => this.setState({ partners: res.data }))
  .catch(error => console.log(error));
};
*/

export const getPartners = (headers) => {
  return axios.get(API_URL_partners, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Partners:", error);
      throw error; 
    });
};

export const getInstructores = (headers) => {
  return axios.get(API_URL_instructores, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching instructores:", error);
      throw error; 
    });
};

export const getUtilidades = (headers) => {
  return axios.get(API_URL_utilidad, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching instructores:", error);
      throw error; 
    });
};

export const getPartidas = (headers) => {
  return axios.get(API_URL_partidas, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching partidas:", error);
      throw error; 
    });
};


export const getPartnersAndInstructors = (headers) => {
  try {
    const instructorsPromise = axios.get(API_URL_instructores, { headers }).then((response) => response.data);
    const partnersPromise = axios.get(API_URL_partners, { headers }).then((response) => response.data);

    return Promise.all([instructorsPromise, partnersPromise])
      .then(([instructors, partners]) => {
        // Create a map for faster lookup
        const instructorsMap = new Map();
        instructors.forEach((instructor) => {
          instructorsMap.set(instructor.instructor, instructor);
        });

        // Combine partners with their respective instructors
        const combinedData = partners.map((partner) => ({
          ...partner,
          instructor: instructorsMap.get(partner.partner),
        }));

        return combinedData;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  } catch (error) {
    console.error("Error in try-catch:", error);
    throw error;
  }
};

export const getUtilitiesByPartner = (headers) => {
  return axios.get(API_URL_utilidades_partners, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Utilidades Partners:", error);
      throw error; 
    });
};






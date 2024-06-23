import axios from "axios";
import { API_URL_partners, API_URL_utilidad } from "../../../constants";

export const fetchPartners = async (headers) => {
    const response = await axios.get(API_URL_partners, { headers });
    const partners = response.data;
    partners.sort((a, b) => a.partner.localeCompare(b.partner));
    return partners;
};

export const fetchUtilidadData = async (headers, proyectoCodeSelected) => {
    const response = await axios.get(API_URL_utilidad, { headers });
    const data = response.data;
    const utilidadData = { amount: {}, percent: {}, honorarios: {} };

    if (data.length > 0) {
        const filteredData = data.filter((item) => item.proyecto_code === proyectoCodeSelected);
        filteredData.forEach((item) => {
            const utilidadType = item.tipo_utilidad;
            utilidadData.amount[utilidadType] = item.cantidad;
            utilidadData.percent[utilidadType] = item.porcentaje;
            utilidadData.honorarios[utilidadType] = item.partner;
        });
    }

    return utilidadData;
};

export const postRequest = async (headers, dataToSend) => {
    try {
        const response = await axios.post(API_URL_utilidad, dataToSend, { headers });
        console.log("Data was loaded successfully:", response.data);
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
};
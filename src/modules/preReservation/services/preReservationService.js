import { request } from "@/services/http.js";
import axios from "axios"; 

/**
 * Obtiene la lista de pre-reservas activas
 * @returns {Promise<Object>} 
 */
export const getActivePreReservations = async () => {
    const response = await request(() => axios.get('/api/pre-reservations/actives'));
    
    return response; 
}

/**
 * Obtiene la lista de pre-reservas vencidas (Paginadas)
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<Object>} 
 */
export const getExpiredPreReservations = async (page = 1, limit = 10) => {
    const response = await request(() => axios.get(`/api/pre-reservations/expired?page=${page}&limit=${limit}`));
    
    return response; 
}
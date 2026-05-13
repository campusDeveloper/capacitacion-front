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
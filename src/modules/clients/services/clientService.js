import axios from "axios";

export const getClients = (params = {}) => {
  return axios.get('/api/customers/list', { params });
};

export const getHeadquarters = async () => {
  const response = await axios.get('/api/select/headquarters');
  return response.data;
};

export const getCustomerTypes = async () => {
  const response = await axios.get('/api/select/customers-types');
  return response.data;
};

export const changeCustomerType = (idCustomer, idType) => {
  return axios.put(`/api/customer/${idCustomer}/change-type`, { idType });
};

export const getCustomerReservations = (idCustomer) => {
  return axios.get(`/api/customer/${idCustomer}/reservations`);
};

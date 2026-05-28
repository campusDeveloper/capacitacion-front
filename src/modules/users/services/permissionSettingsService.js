import axios from 'axios';

const PERMISSIONS_URL = '/api/users/permisos';

export const getPermissionsMatrix = () => {
    return axios.get(PERMISSIONS_URL);
};

export const updatePermission = ({ idUser, module, value }) => {
    return axios.post(`${PERMISSIONS_URL}/update`, {
        idUser,
        module,
        value
    });
};

export const updateBulkPermissions = (payload) => {
    return axios.post(`${PERMISSIONS_URL}/update-all`, payload);
};

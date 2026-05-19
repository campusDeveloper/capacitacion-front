import axios from 'axios'
import Cookies from 'js-cookie';
import router from '../shared/router/index';

// Base URL para todas las llamadas a la API
axios.defaults.withCredentials = true;

axios.interceptors.request.use(request => {
    const token = Cookies.get('token');
    if (token && request.url.indexOf('s3.amazonaws.com') === -1) request.headers.Authorization = `Bearer ${token}`
    return request
})

axios.interceptors.response.use(response => response, error => {
    const { status } = error.response
    if (status >= 500) console.error(error)
    if (status === 401){
        Cookies.remove('token')
        router.push({ name: 'login' })
    }
    if (status === 403){
        Cookies.remove('token')
        router.push({ name: 'login' });
    }
    return Promise.reject(error)
})

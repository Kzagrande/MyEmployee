import axios from 'axios'

const http = axios.create({baseURL:'http://localhost:3001'})
http.defaults.withCredentials = true;

export default http
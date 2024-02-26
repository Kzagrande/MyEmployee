import axios from 'axios'

const http = axios.create({baseURL:'https://myemployee.com.br/api'})
http.defaults.withCredentials = true;

export default http
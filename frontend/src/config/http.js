import axios from 'axios'

const http = axios.create({baseURL:'http://myemployee.com.br/api'})

export default http
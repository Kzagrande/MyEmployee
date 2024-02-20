import axios from 'axios'

const http = axios.create({baseURL:'https://myemployee.com.br/api'})

export default http
import axios from 'axios'


const http = axios.create({baseURL:'http://api.myemployee.com.br/v1'})

export default http
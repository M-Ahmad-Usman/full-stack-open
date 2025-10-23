import axios from 'axios'

const baseURL = 'https://studies.cs.helsinki.fi/restcountries'

const getAllCountries = () => {

    const req = axios
        .get(`${baseURL}/api/all`)

    return req.then(res => res.data)
}

export default { getAllCountries }
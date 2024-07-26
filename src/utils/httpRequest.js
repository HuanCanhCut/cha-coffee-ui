import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
})

export const get = async (path, options = {}) => {
    const response = await request.get(path, options)
    return response
}

export const post = async (path, data, options = {}) => {
    const response = await request.post(path, data, options)
    return response
}

export const patch = async (path, data, options = {}) => {
    const response = await request.patch(path, data, options)
    return response
}

export const deleteMethod = async (path, options = {}) => {
    const response = await request.delete(path, options)
    return response
}

export default request

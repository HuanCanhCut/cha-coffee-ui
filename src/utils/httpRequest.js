import axios from 'axios'
import { showToast } from '~/project/services.'

const request = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_APP_BASE_URL,
})

// once refresh token
let refreshTokenRequest = null

const refreshToken = async () => {
    return await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}auth/refresh`,
        {},
        {
            withCredentials: true,
        }
    )
}

request.interceptors.request.use(
    async (config) => {
        const tokenExpired = localStorage.getItem('exp')

        if (!tokenExpired) {
            return config
        }

        if (tokenExpired < Math.floor(Date.now() / 1000)) {
            try {
                refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : refreshToken()

                const response = await refreshTokenRequest

                localStorage.setItem('exp', response?.data?.exp)
                refreshTokenRequest = null
            } catch (error) {
                console.log(error)

                if (error.response.status === 401) {
                    showToast({
                        message: 'Refresh token đã hết hạn, vui lòng đăng nhập lại',
                        type: 'warning',
                    })
                }
                console.log(error)
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export const get = async (path, options = {}) => {
    const response = await request.get(path, options)
    return response
}

export const post = async (path, data = [], options = {}) => {
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

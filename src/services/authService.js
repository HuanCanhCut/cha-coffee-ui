import { showToast } from '~/project/services.'
import request from '../utils/httpRequest'

export const login = async ({ email, password }) => {
    try {
        const response = await request.post('auth/login', {
            email,
            password,
        })

        return response.data
    } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
            showToast({ message: 'Tài khoản đã tồn tại' })
        }
    }
}

export const getCurrentUser = async ({ accessToken }) => {
    try {
        const response = await request.get('auth/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

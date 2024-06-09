import { showToast } from '~/project/services.'
import * as request from '../utils/httpRequest'

export const login = async ({ email, password }) => {
    try {
        return await request.post('auth/login', {
            email,
            password,
        })
    } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
            showToast({ message: 'Tài khoản đã tồn tại' })
        }
    }
}

export const getCurrentUser = async ({ accessToken }) => {
    try {
        return await request.get('auth/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    } catch (error) {
        console.log(error)
    }
}

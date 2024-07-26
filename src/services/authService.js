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

export const logout = async ({ accessToken }) => {
    try {
        return await request.post('auth/logout', [], {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    } catch (error) {
        console.log(error)
    }
}

export const register = async ({ email, password, type = 'email' }) => {
    try {
        return await request.post('auth/register', {
            type,
            email,
            password,
        })
    } catch (error) {
        console.log(error)
        if (error.response.status === 409) {
            showToast({ message: 'Tài khoản đã tồn tại', type: 'error' })
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

export const updateCurrentUser = async ({ accessToken, userName, phone_number, address }) => {
    try {
        return await request.patch(
            'auth/me',
            {
                user_name: userName,
                phone_number,
                address,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
    } catch (error) {
        console.log(error)
    }
}

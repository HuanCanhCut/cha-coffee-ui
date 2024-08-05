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

export const loginWithGoogle = async ({ token }) => {
    try {
        return await request.post('auth/login/google', {
            token,
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async () => {
    try {
        return await request.post('auth/logout')
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

export const getCurrentUser = async () => {
    try {
        return await request.get('auth/me')
    } catch (error) {
        console.log(error)
    }
}

export const updateCurrentUser = async ({ userName, phone_number, address }) => {
    try {
        return await request.patch('auth/me', {
            user_name: userName,
            phone_number,
            address,
        })
    } catch (error) {
        console.log(error)
    }
}

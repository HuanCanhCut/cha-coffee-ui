import { showToast } from '~/project/services.'
import * as request from '../utils/httpRequest'

export const login = async ({ email, password }) => {
    try {
        return await request.post('auth/login', {
            email,
            password,
        })
    } catch (error) {
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
        showToast({ message: 'Đăng nhập thất bại, vui lòng thử lại', type: 'error' })
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
        //
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

export const sendVerificationCode = async ({ email }) => {
    try {
        return await request.post('auth/send-verification-code', {
            email,
        })
    } catch (error) {
        console.log(error)
    }
}

export const forgotPassword = async ({ email, newPassword, resetCode }) => {
    try {
        return await request.patch('auth/forgot', {
            email,
            reset_code: resetCode,
            new_password: newPassword,
        })
    } catch (error) {
        if (error?.response?.status === 401) {
            showToast({ message: 'Mã xác minh không đúng', type: 'error' })
        }
    }
}

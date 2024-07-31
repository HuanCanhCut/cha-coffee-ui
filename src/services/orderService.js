import * as request from '../utils/httpRequest'

export const createOrder = async ({ accessToken, data }) => {
    try {
        return await request.post('order', data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    } catch (error) {
        console.log(error)
    }
}

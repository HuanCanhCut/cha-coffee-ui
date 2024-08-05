import * as request from '../utils/httpRequest'

export const createOrder = async ({ data }) => {
    try {
        return await request.post('order', data)
    } catch (error) {
        console.log(error)
    }
}

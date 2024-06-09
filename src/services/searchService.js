import * as request from '~/utils/httpRequest'

export const search = async (q = '') => {
    try {
        return await request.get('/products/search', {
            params: {
                q,
            },
        })
    } catch (error) {
        console.log(error)
    }
}

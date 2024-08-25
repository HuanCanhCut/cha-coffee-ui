import * as request from '../utils/httpRequest'

export const getStores = async () => {
    try {
        return await request.get('/store')
    } catch (error) {
        console.log(error)
    }
}

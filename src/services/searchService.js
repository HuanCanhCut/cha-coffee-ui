import request from '~/utils/httpRequest'

export const search = async ({ q = '' }) => {
    try {
        const response = await request.get('search', {
            params: {
                q,
            },
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

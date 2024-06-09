import { showToast } from '~/project/services.'
import * as request from '~/utils/httpRequest'

export const getProducts = async () => {
    try {
        return await request.get('/products')
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async ({ productID, accessToken }) => {
    try {
        return await request.deleteMethod(`/products/${productID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    } catch (error) {
        showToast({ message: `Xóa sản phẩm thất bại. ${error?.response?.data?.message}`, type: 'error' })
    }
}

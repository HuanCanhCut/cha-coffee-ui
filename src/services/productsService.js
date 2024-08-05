import { showToast } from '~/project/services.'
import * as request from '~/utils/httpRequest'

export const getProducts = async () => {
    try {
        return await request.get('/products')
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async ({ productID }) => {
    try {
        return await request.deleteMethod(`/products/${productID}`)
    } catch (error) {
        showToast({ message: `Xóa sản phẩm thất bại. ${error?.response?.data?.message}`, type: 'error' })
    }
}

export const updateProduct = async ({ productID, formData }) => {
    try {
        return await request.patch(`/products/${productID}`, formData)
    } catch (error) {
        showToast({ message: `Cập nhật sản phẩm thất bại. ${error?.response?.data?.message}`, type: 'error' })
        console.log(error)
    }
}

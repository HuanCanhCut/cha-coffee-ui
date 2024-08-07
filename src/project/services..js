import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as authServices from '~/services/authService'
import numeral from 'numeral'
import { actions } from '~/redux'

export const showToast = ({ message, type = 'success', duration = 4000 }) => {
    return toast[type](message, {
        position: 'top-right',
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
    })
}

export const groupProductByCategory = (products) => {
    const groupProducts = products.reduce((acc, cur) => {
        if (!acc[cur.category]) {
            acc[cur.category] = []
        }
        acc[cur.category].push(cur)
        return acc
    }, {})

    return groupProducts
}

export const formatPrice = (price) => {
    return numeral(price).format('0,0').replace(/,/g, '.')
}

export const removeProductFromCart = ({ dispatch, product, products }) => {
    dispatch(
        actions.removeAProductFromCart({
            product,
            products,
        })
    )
}

export const incrementQuantity = ({ dispatch, product, products }) => {
    dispatch(actions.addProductsToCart({ product, products }))
}

export const decrementQuantity = ({ dispatch, product, products }) => {
    dispatch(actions.subProductsToCart({ product, products }))
}

export const logout = async ({ dispatch }) => {
    const response = await authServices.logout()
    if (response?.status === 204) {
        dispatch(actions.currentUser(null))
        window.location.reload()
    } else {
        showToast('Đăng xuất thất bại, vui lòng liên hệ quản lí.')
    }
}

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import numeral from 'numeral'

export const showToast = ({ message, type = 'success', duration = 3500 }) => {
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

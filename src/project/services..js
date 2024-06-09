import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

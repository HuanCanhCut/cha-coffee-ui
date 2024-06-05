import classNames from 'classnames'
import { useState } from 'react'
import style from './Image.module.scss'

const noImage = 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg'

// eslint-disable-next-line react/prop-types
const Image = ({ src, alt, className, fallback: customFallback = noImage, ...props }) => {
    const [fallback, setFallback] = useState('')

    const handleError = () => {
        setFallback(customFallback)
    }

    return (
        <img
            className={classNames(style.wrapper, className)}
            src={fallback || src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    )
}

export default Image
